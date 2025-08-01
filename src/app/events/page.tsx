'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { publicClient, walletClient } from '../config';
import { EVENT_CONTRACT_ADDRESS } from '../address';
import eventAbi from '../eventabi.json';

interface Event {
  id: string;
  name: string;
  description: string;
  activeUntil: Date;
  walletAddress: string;
  createdDate: Date;
  endDate: Date;
  balance: number;
}

const EventsPage = () => {
  const { address } = useAccount();
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    activeUntil: '',
    walletAddress: ''
  });

  // Fetch all events from contract
  const fetchEvents = async () => {
    try {
      const eventsData = await publicClient.readContract({
        address: EVENT_CONTRACT_ADDRESS as `0x${string}`,
        abi: eventAbi,
        functionName: 'getAllEvents',
      });
      
      console.log('Events data:', eventsData);
      
      // The new ABI returns a struct array: Event[]
      const allEvents = eventsData as any[];
      
      // Convert struct array to event objects
      const combinedEvents = allEvents.map((event, index) => ({
        id: index.toString(),
        name: event.name,
        description: event.description,
        activeUntil: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)), // Simulate end date
        walletAddress: event.owner,
        createdDate: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Simulate creation time
        endDate: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)), // Simulate end date
        balance: 0 // Since balance is not in the new ABI
      }));
      
      setEvents(combinedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async () => {
    if (newEvent.name && newEvent.description && newEvent.walletAddress) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        // Simulate the contract call
        const { request } = await publicClient.simulateContract({
          address: EVENT_CONTRACT_ADDRESS as `0x${string}`,
          abi: eventAbi,
          functionName: 'createEvent',
          args: [newEvent.name, newEvent.description, newEvent.walletAddress as `0x${string}`],
          account: address,
        });

        // Write to the contract
        const hash = await walletClient.writeContract(request);
        await publicClient.waitForTransactionReceipt({ hash });

        setSuccess('Event created successfully!');
        setNewEvent({ name: '', description: '', activeUntil: '', walletAddress: '' });
        setShowCreateForm(false);
        
        // Refresh events list
        setTimeout(() => {
          fetchEvents();
        }, 2000);
      } catch (err) {
        console.error('Error creating event:', err);
        setError('Failed to create event. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const withdrawFromEvent = (eventId: string) => {
    // Handle withdrawal logic
    console.log('Withdrawing from event:', eventId);
  };

  const openDepositModal = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEventId(eventId);
    setSelectedEvent(event || null);
    setShowDepositModal(true);
    setDepositAmount('');
  };

  const handleDeposit = async () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      setError('Deposit functionality not available in current contract');
      setShowDepositModal(false);
      setDepositAmount('');
      setSelectedEventId('');
    }
  };

  // Sample event data
  const sampleEvent: Event = {
    id: '1',
    name: 'Summer Beach Party',
    description: 'Join us for an amazing beach party with live music, food, and drinks. Perfect for celebrating summer!',
    activeUntil: new Date('2024-08-15T20:00:00'),
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    createdDate: new Date('2024-07-01T10:00:00'),
    endDate: new Date('2024-08-15T20:00:00'),
    balance: 1250
  };

  const renderEventCard = (event: Event) => (
    <div className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 rounded-2xl shadow-2xl p-6 border-t-2 border-l-2 border-r border-b-8 border-t-blue-200 border-l-blue-200 border-r-blue-200 border-b-black max-w-md mx-auto">
      {/* Event Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-black text-blue-900 mb-2" style={{
          textShadow: '-1px 1px 0 #ffffff'
        }}>
          {event.name}
        </h3>
        <p className="text-black font-medium">{event.description}</p>
      </div>

      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-300">
          <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">End Date</span>
          <span className="text-sm font-bold text-blue-900">
            {event.endDate.toLocaleDateString()} {event.endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
      </div>

      {/* Created Date - Small */}
      <div className="text-xs text-black mb-4 text-center">
        Created: {event.createdDate.toLocaleDateString()} at {event.createdDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => openDepositModal(event.id)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 font-bold shadow-lg border-2 border-green-400 text-sm"
          style={{
            textShadow: '-1px 1px 0 #000000'
          }}
        >
          DEPOSIT
        </button>
        <button
          onClick={() => console.log('View details for event:', event.id)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 font-bold shadow-lg border-2 border-blue-400 text-sm"
          style={{
            textShadow: '-1px 1px 0 #000000'
          }}
        >
          VIEW DETAILS
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-200 p-6 relative">
      {/* Noun Image - Top Left */}
      <div className="absolute top-8 left-8 w-48 h-48 opacity-80 z-10">
        <img
          src="https://noun.pics/1311.png"
          alt="NOUN 1311"
          className="w-full h-full object-contain drop-shadow-2xl rounded-full"
        />
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-red-600" style={{
            textShadow: '-4px 4px 0 #ffffff',
            WebkitTextStroke: '2px #ffffff'
          }}>
            EVENTS
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-3xl mx-auto">
            Create and manage your events with smart payment features
          </p>
        </div>

        {/* Create Event Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-bold text-xl shadow-2xl"
            style={{
              textShadow: '-2px 2px 0 #000000'
            }}
          >
            + CREATE EVENT
          </button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-blue-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-gray-800" style={{
                textShadow: '-1px 1px 0 #e5e7eb'
              }}>
                CREATE EVENT
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-red-600 text-xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4 font-medium">
              Fill in the event details to create your new event
            </p>

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm font-medium mb-4">{success}</p>}

            <div className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-2 uppercase tracking-wide">
                  Event Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter event name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-sm font-bold text-purple-700 mb-2 uppercase tracking-wide">
                  Event Description *
                </label>
                <textarea
                  placeholder="Describe your event"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-medium text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Active Until */}
              <div>
                <label className="block text-sm font-bold text-green-700 mb-2 uppercase tracking-wide">
                  Time Till Event is Active *
                </label>
                <input
                  type="datetime-local"
                  value={newEvent.activeUntil}
                  onChange={(e) => setNewEvent({...newEvent, activeUntil: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900 bg-white"
                />
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-bold text-orange-700 mb-2 uppercase tracking-wide">
                  Wallet Address *
                </label>
                <input
                  type="text"
                  placeholder="Enter wallet address"
                  value={newEvent.walletAddress}
                  onChange={(e) => setNewEvent({...newEvent, walletAddress: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={createEvent}
                  disabled={!newEvent.name || !newEvent.description || !newEvent.walletAddress || loading}
                  className={`flex-1 px-4 py-3 text-white rounded-lg transition-all transform hover:scale-105 font-bold shadow-lg ${
                    newEvent.name && newEvent.description && newEvent.walletAddress && !loading
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  style={{
                    textShadow: newEvent.name && newEvent.description && newEvent.walletAddress && !loading ? '-1px 1px 0 #000000' : 'none'
                  }}
                >
                  {loading ? 'CREATING...' : 'CREATE EVENT'}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all transform hover:scale-105 font-bold shadow-lg"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deposit Modal */}
        {showDepositModal && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pt-20">
            <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-green-300 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-green-800" style={{
                  textShadow: '-1px 1px 0 #ffffff'
                }}>
                  DEPOSIT TO EVENT
                </h2>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="text-green-600 hover:text-red-600 text-xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Event Wallet Information */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-green-700 uppercase tracking-wide">Event Wallet:</span>
                  <span className="text-sm font-mono text-green-700 bg-green-100 px-2 py-1 rounded">
                    {selectedEvent.walletAddress}
                  </span>
                </div>
              </div>

              <p className="text-sm text-green-700 mb-4 font-medium">
                Enter the amount you want to deposit to this event
              </p>

              {/* Error and Success Messages */}
              {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}
              {success && <p className="text-green-500 text-sm font-medium mb-4">{success}</p>}

              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-bold text-green-700 mb-2 uppercase tracking-wide">
                    Amount (BNB) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleDeposit}
                    disabled={!depositAmount || parseFloat(depositAmount) <= 0 || loading}
                    className={`flex-1 px-4 py-3 text-white rounded-lg transition-all transform hover:scale-105 font-bold shadow-lg ${
                      depositAmount && parseFloat(depositAmount) > 0 && !loading
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    style={{
                      textShadow: depositAmount && parseFloat(depositAmount) > 0 && !loading ? '-1px 1px 0 #000000' : 'none'
                    }}
                  >
                    {loading ? 'DEPOSITING...' : 'DEPOSIT'}
                  </button>
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all transform hover:scale-105 font-bold shadow-lg"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index}>
                {renderEventCard(event)}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-800 text-xl font-medium">
                No events created yet. Create your first event!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;