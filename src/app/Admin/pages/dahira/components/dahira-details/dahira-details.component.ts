import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DahiraService } from '../../services/dahira.service';
import { UserService } from '../../services/user.service';
import { Dahira, DahiraMember, MemberRole } from '../../models/dahira.model';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dahira-details',
  templateUrl: './dahira-details.component.html',
  styleUrls: ['./dahira-details.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class DahiraDetailsComponent implements OnInit {
  dahiraId: string = '';
  dahira: Dahira | null = null;
  members: DahiraMember[] = [];
  filteredMembers: DahiraMember[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  selectedFilter: string = 'all';
  
  showAddMemberModal: boolean = false;
  showRemoveMemberModal: boolean = false;
  showMemberActions: boolean = false;
  usersWithoutDahira: User[] = [];
  selectedUser: User | null = null;
  selectedMember: DahiraMember | null = null;
  selectedRole: MemberRole = MemberRole.DISCIPLE;
  
  roleOptions = [
    { value: MemberRole.DISCIPLE, label: 'Disciple' },
    { value: MemberRole.MOUKHADAM, label: 'Moukhadam' }
  ];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dahiraService: DahiraService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.dahiraId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.dahiraId) {
      this.loadDahiraDetails();
      this.loadDahiraMembers();
    } else {
      this.router.navigate(['admin/dahiras']);
    }
  }

  loadDahiraDetails(): void {
    this.loading = true;
    this.dahiraService.getDahiraById(this.dahiraId).subscribe({
      next: (dahira) => {
        this.dahira = dahira;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails du dahira', error);
        this.loading = false;
        this.router.navigate(['admin/dahiras']);
      }
    });
  }

  loadDahiraMembers(): void {
    this.loading = true;
    this.dahiraService.getDahiraMembers(this.dahiraId).subscribe({
      next: (members) => {
        this.members = members;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres du dahira', error);
        this.loading = false;
      }
    });
  }
  
  applyFilters(): void {
    // Appliquer la recherche
    let result = [...this.members];
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      result = result.filter(member => 
        member.user.firstName.toLowerCase().includes(searchLower) ||
        member.user.lastName.toLowerCase().includes(searchLower) ||
        member.user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Appliquer le filtre par rôle
    if (this.selectedFilter !== 'all') {
      result = result.filter(member => member.role === this.selectedFilter);
    }
    
    this.filteredMembers = result;
  }
  
  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }
  
  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }
  
  openAddMemberModal(): void {
    this.loadUsersWithoutDahira();
    this.showAddMemberModal = true;
  }
  
  loadUsersWithoutDahira(): void {
    this.userService.getUsersWithoutDahira().subscribe({
      next: (users) => {
        this.usersWithoutDahira = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs sans dahira', error);
      }
    });
  }
  
  selectUser(user: User): void {
    this.selectedUser = user;
  }
  
  addMember(): void {
    if (this.selectedUser && this.selectedRole) {
      this.dahiraService.addMemberToDahira(this.dahiraId, this.selectedUser.id, this.selectedRole).subscribe({
        next: (success) => {
          if (success) {
            this.showAddMemberModal = false;
            this.selectedUser = null;
            this.loadDahiraMembers();
          }
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du membre', error);
        }
      });
    }
  }
  
  toggleMemberActions(member: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (this.selectedMember && this.selectedMember.userId === member.userId) {
      this.showMemberActions = !this.showMemberActions;
    } else {
      this.selectedMember = member;
      this.showMemberActions = true;
    }
  }
  
  closeMemberActions(): void {
    this.showMemberActions = false;
  }
  
  viewMemberDetails(member: DahiraMember, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    // Naviguer vers les détails du membre
    this.router.navigate(['/users', member.userId]);
    this.closeMemberActions();
  }
  
  openRemoveMemberModal(member: DahiraMember, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedMember = member;
    this.showRemoveMemberModal = true;
    this.closeMemberActions();
  }
  
  removeMember(): void {
    if (this.selectedMember) {
      this.dahiraService.removeMemberFromDahira(this.dahiraId, this.selectedMember.userId).subscribe({
        next: (success) => {
          if (success) {
            this.showRemoveMemberModal = false;
            this.selectedMember = null;
            this.loadDahiraMembers();
          }
        },
        error: (error) => {
          console.error('Erreur lors du retrait du membre', error);
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.member-actions-btn') && !target.closest('.member-actions-menu') && this.showMemberActions) {
      this.showMemberActions = false;
    }
  }
  
  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
    this.selectedUser = null;
  }
  
  closeRemoveMemberModal(): void {
    this.showRemoveMemberModal = false;
    this.selectedMember = null;
  }
  
  goBack(): void {
    this.router.navigate(['admin/dahira']);
  }
  
  getRoleBadgeClass(role: MemberRole): string {
    switch (role) {
      case MemberRole.RESPONSIBLE:
        return 'bg-purple-100 text-purple-800';
      case MemberRole.MOUKHADAM:
        return 'bg-blue-100 text-blue-800';
      case MemberRole.DISCIPLE:
      default:
        return 'bg-green-100 text-green-800';
    }
  }
  
  getRoleLabel(role: MemberRole): string {
    switch (role) {
      case MemberRole.RESPONSIBLE:
        return 'Responsable';
      case MemberRole.MOUKHADAM:
        return 'Moukhadam';
      case MemberRole.DISCIPLE:
      default:
        return 'Disciple';
    }
  }
}