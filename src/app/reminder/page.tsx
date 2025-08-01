'use client';

import React, { useState } from 'react';

const ReminderPage = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'events'>('groups');

  // Mock data for reminders
  const groupReminders = [
    {
      id: 1,
      type: 'group_invite',
      title: 'New Group Invitation',
      message: 'Alice added you as a recipient in "Room Rent Split" group',
      amount: '$500',
      groupName: 'Room Rent Split',
      time: '2 hours ago',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      type: 'payment_due',
      title: 'Payment Reminder',
      message: 'You have a pending payment of $75 for "Utility Bills" group',
      amount: '$75',
      groupName: 'Utility Bills',
      time: '1 day ago',
      status: 'overdue',
      priority: 'urgent'
    },
    {
      id: 3,
      type: 'group_invite',
      title: 'New Group Invitation',
      message: 'Bob invited you to join "Vacation Fund" group',
      amount: '$200',
      groupName: 'Vacation Fund',
      time: '3 days ago',
      status: 'pending',
      priority: 'medium'
    }
  ];

  const eventReminders = [
    {
      id: 1,
      type: 'event_invite',
      title: 'Event Invitation',
      message: 'Sarah invited you to "Birthday Party" event',
      eventName: 'Birthday Party',
      date: 'Dec 15, 2024',
      time: '1 hour ago',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      type: 'event_reminder',
      title: 'Event Reminder',
      message: 'Your "Team Dinner" event is tomorrow',
      eventName: 'Team Dinner',
      date: 'Dec 10, 2024',
      time: '2 days ago',
      status: 'upcoming',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'event_invite',
      title: 'Event Invitation',
      message: 'Mike invited you to "New Year Party" event',
      eventName: 'New Year Party',
      date: 'Dec 31, 2024',
      time: '5 days ago',
      status: 'pending',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      case 'upcoming': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4F46E5] via-[#7C3AED] to-[#1E40AF] p-6 relative">
      {/* Noun Image - Top Left */}
      <div className="absolute top-8 left-8 w-48 h-48 opacity-80 z-10">
        <img
          src="https://noun.pics/1312.png"
          alt="NOUN 1312"
          className="w-full h-full object-contain drop-shadow-2xl rounded-full"
        />
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-white" style={{
            textShadow: '-2px 2px 0 #000',
            WebkitTextStroke: '1px #000'
          }}>
            AI Reminders
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Smart notifications for your groups and events. Never miss a payment or invitation again.
          </p>
        </div>

        {/* AI Assistant Card */}
        <div className="bg-gradient-to-b from-green-500 via-green-600 to-green-700 p-6 rounded-xl border border-white/20 border-b-8 border-b-black mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">🤖</div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Assistant</h3>
              <p className="text-white/80">Smart suggestions based on your activity</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-200 p-4 rounded-lg text-black">
              <div className="text-2xl font-bold mb-2">📊</div>
              <p className="text-base font-semibold">You have 3 pending responses</p>
            </div>
            <div className="bg-orange-200 p-4 rounded-lg text-black">
              <div className="text-2xl font-bold mb-2">💰</div>
              <p className="text-base font-semibold">$275 in pending payments</p>
            </div>
            <div className="bg-orange-200 p-4 rounded-lg text-black">
              <div className="text-2xl font-bold mb-2">🎯</div>
              <p className="text-base font-semibold">2 events this week</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'groups'
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              👥 Groups ({groupReminders.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'events'
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              🎉 Events ({eventReminders.length})
            </button>
          </div>
        </div>

        {/* Reminders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'groups' ? (
            groupReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-orange-200 p-6 rounded-xl border border-orange-300 border-b-8 border-b-black hover:scale-105 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(reminder.priority)}`}></div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(reminder.status)}`}>
                      {reminder.status}
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm">{reminder.time}</span>
                </div>
                
                <h3 className="text-lg font-bold text-black mb-2">{reminder.title}</h3>
                <p className="text-gray-700 mb-4">{reminder.message}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Group</p>
                    <p className="text-black font-semibold">{reminder.groupName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Amount</p>
                    <p className="text-black font-bold text-lg">{reminder.amount}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-600 transition-colors">
                    Accept
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-600 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            eventReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-orange-200 p-6 rounded-xl border border-orange-300 border-b-8 border-b-black hover:scale-105 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(reminder.priority)}`}></div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(reminder.status)}`}>
                      {reminder.status}
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm">{reminder.time}</span>
                </div>
                
                <h3 className="text-lg font-bold text-black mb-2">{reminder.title}</h3>
                <p className="text-gray-700 mb-4">{reminder.message}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Event</p>
                    <p className="text-black font-semibold">{reminder.eventName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Date</p>
                    <p className="text-black font-bold">{reminder.date}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-600 transition-colors">
                    Join Event
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-600 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-b from-green-500 via-green-600 to-green-700 p-6 rounded-xl border border-white/20 border-b-8 border-b-black">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-amber-200 text-black p-4 rounded-lg font-bold hover:scale-105 transition-all">
              📝 Mark All Read
            </button>
            <button className="bg-amber-200 text-black p-4 rounded-lg font-bold hover:scale-105 transition-all">
              🔔 Notification Settings
            </button>
            <button className="bg-amber-200 text-black p-4 rounded-lg font-bold hover:scale-105 transition-all">
              📊 View Analytics
            </button>
            <button className="bg-amber-200 text-black p-4 rounded-lg font-bold hover:scale-105 transition-all">
              ⚙️ AI Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderPage;