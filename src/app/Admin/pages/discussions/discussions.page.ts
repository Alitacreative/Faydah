import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Channel, Message, OnlineUser } from './models/discussion.model';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.page.html',
  styleUrls: ['./discussions.page.scss'],
  standalone: false
})
export class DiscussionsPage implements OnInit {

  channels: Channel[] = []
  messages: Message[] = []
  onlineUsers: OnlineUser[] = []
  activeChannel: Channel | null = null
  newMessage = ""
  searchTerm = ""
  // Gestion du textarea auto-resize et des touches
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  ngOnInit() {
    this.channels = [
      { id: 1, name: "Dahira Medina", unread: 0 },
      { id: 2, name: "Grand Yoff", unread: 2 },
      { id: 3, name: "Medina Mbaye", unread: 0 },
      { id: 4, name: "Moussa Yel", unread: 0 },
      { id: 5, name: "Dahira centre", unread: 0 },
    ]

    this.activeChannel = this.channels[1] // Événements

    this.messages = [
      {
        id: 1,
        user: { name: "Leslie Alexander", avatar: "/assets/placeholder.svg?height=40&width=40", role: "Mouqadam" },
        message: "Bonjour à tous ! J'espère que vous allez bien. Je voulais vous rappeler l'événement de ce weekend.",
        timestamp: new Date(2025, 4, 10, 9, 30),
        status: 'sent'
      },
      {
        id: 2,
        user: { name: "Guy Hawkins", avatar: "/assets/placeholder.svg?height=40&width=40", role: "Balmadi" },
        message: "Merci pour le rappel ! À quelle heure commence-t-il déjà ?",
        timestamp: new Date(2025, 4, 10, 9, 45),
        status: 'sent'
      },
      {
        id: 3,
        user: { name: "Leslie Alexander", avatar: "/assets/placeholder.svg?height=40&width=40", role: "Mouqadam" },
        message: "L'événement commence à 14h au centre communautaire. N'oubliez pas d'apporter vos livres.",
        timestamp: new Date(2025, 4, 10, 10, 0),
        status: 'read'
      },
      {
        id: 4,
        user: { name: "Kristin Watson", avatar: "/assets/placeholder.svg?height=40&width=40", role: "Mouqadam" },
        message: "Est-ce que quelqu'un peut s'occuper des rafraîchissements ?",
        timestamp: new Date(2025, 4, 10, 10, 15),
        status: 'read'
      },
      {
        id: 5,
        user: { name: "Robert Fox", avatar: "/assets/placeholder.svg?height=40&width=40", role: "Disciples" },
        message: "Je peux m'en occuper ! Je vais apporter des boissons et quelques snacks.",
        timestamp: new Date(2025, 4, 10, 10, 30),
        status: 'read'
      },
      {
        id: 6,
        user: { name: "Dumont", avatar: "/assets/placeholder.svg?height=40&width=40", role: "Admin" },
        message: "Excellent ! Merci Robert. Je vais préparer la salle dès 13h pour que tout soit prêt.",
        timestamp: new Date(2025, 4, 10, 10, 45),
        isCurrentUser: true,
        status: 'sent'
      },
    ]

    this.onlineUsers = [
      { name: "Dumont", avatar: "/assets/placeholder.svg?height=32&width=32", role: "Admin", isOnline: true },
      {
        name: "Leslie Alexander",
        avatar: "/assets/placeholder.svg?height=32&width=32",
        role: "Mouqadam",
        isOnline: true,
      },
      { name: "Guy Hawkins", avatar: "/assets/placeholder.svg?height=32&width=32", role: "Balmadi", isOnline: true },
      {
        name: "Kristin Watson",
        avatar: "/assets/placeholder.svg?height=32&width=32",
        role: "Mouqadam",
        isOnline: true,
      },
      { name: "Robert Fox", avatar: "/assets/placeholder.svg?height=32&width=32", role: "Disciples", isOnline: false },
    ]
  }

  setActiveChannel(channel: Channel) {
    this.activeChannel = channel
    // In a real app, we would load messages for this channel
    // And mark unread messages as read
    channel.unread = 0
  }



handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    this.sendMessage();
  }
  // Auto-resize du textarea
  setTimeout(() => {
    this.messageInput.nativeElement.style.height = 'auto';
    this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
  }, 0);
}

ngAfterViewInit() {
  // Initial resize
  this.messageInput.nativeElement.style.height = 'auto';
  this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
}

  sendMessage() {
    if (!this.newMessage.trim()) return

    // In a real app, we would send this message to a backend
    const newMsg: Message = {
      id: this.messages.length + 1,
      user: { name: "Dumont", avatar: "/assets/placeholder.svg?height=40&width=40", role: "Admin" },
      message: this.newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
      status: ''
    }

    this.messages.push(newMsg)
    this.newMessage = ""

    // Scroll to bottom after message is added
    setTimeout(() => {
      const messagesContainer = document.getElementById("messages-container")
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }, 0)
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  filterChannels(): Channel[] {
    if (!this.searchTerm) return this.channels

    const term = this.searchTerm.toLowerCase()
    return this.channels.filter((channel) => channel.name.toLowerCase().includes(term))
  }
}
