'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { publicClient, walletClient } from '../config';
import { GROUP_CONTRACT_ADDRESS } from '../address';
import groupAbi from '../groupabi.json';

interface Recipient {
  id: string;
  address: string;
  amount: number;
  description: string;
}

interface GroupDetails {
  id: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'completed';
  createdAt: Date;
  recipients: Recipient[];
}

const GroupPage = () => {
  const { address } = useAccount();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recipientInputs, setRecipientInputs] = useState([
    { id: 1, address: '' }
  ]);
  const [groupName, setGroupName] = useState('');
  const [sharedAmount, setSharedAmount] = useState('');
  const [sharedDescription, setSharedDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formRecipientInputs, setFormRecipientInputs] = useState([
    { id: 1, address: '' }
  ]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);

  // Mock group details - in real app this would come from props or API
  const [groupDetails] = useState<GroupDetails>({
    id: 'group-001',
    totalAmount: 0,
    status: 'pending',
    createdAt: new Date(),
    recipients: []
  });

  const addRecipient = (inputId: number) => {
    const input = recipientInputs.find(inp => inp.id === inputId);
    if (input && input.address && sharedAmount) {
      const newRecipient: Recipient = {
        id: Date.now().toString(),
        address: input.address,
        amount: parseFloat(sharedAmount),
        description: sharedDescription || 'Payment'
      };
      
      setRecipients([...recipients, newRecipient]);
      
      // Clear this input
      setRecipientInputs(prev => prev.map(inp => 
        inp.id === inputId 
          ? { ...inp, address: '' }
          : inp
      ));
      
      console.log('Recipient added successfully');
    }
  };

  const addNewInput = () => {
    const newId = Math.max(...recipientInputs.map(inp => inp.id)) + 1;
    setRecipientInputs([...recipientInputs, { id: newId, address: '' }]);
  };

  const removeInput = (inputId: number) => {
    if (recipientInputs.length > 1) {
      setRecipientInputs(prev => prev.filter(inp => inp.id !== inputId));
    }
  };

  const updateInput = (inputId: number, value: string) => {
    setRecipientInputs(prev => prev.map(inp => 
      inp.id === inputId ? { ...inp, address: value } : inp
    ));
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(recipient => recipient.id !== id));
  };

  const totalAmount = recipients.reduce((sum, recipient) => sum + recipient.amount, 0);

  // Fetch all groups from contract
  const fetchGroups = async () => {
    try {
      const groupsData = await publicClient.readContract({
        address: GROUP_CONTRACT_ADDRESS as `0x${string}`,
        abi: groupAbi,
        functionName: 'getAllGroups',
      });
      
      // The new ABI returns separate arrays: [names, descriptions, totalAmounts, allRecipients]
      const [names, descriptions, totalAmounts, allRecipients] = groupsData as [string[], string[], bigint[], string[][]];
      
      console.log('Groups data:', { names, descriptions, totalAmounts, allRecipients });
      console.log('Total amounts (raw):', totalAmounts);
      console.log('Total amounts (converted):', totalAmounts.map(amount => Number(amount) / 1e18));
      
      // Get group count to fetch individual group details
      const groupCount = await publicClient.readContract({
        address: GROUP_CONTRACT_ADDRESS as `0x${string}`,
        abi: groupAbi,
        functionName: 'getGroupCount',
      }) as bigint;
      
      console.log('Total groups:', Number(groupCount));
      
      // Try to get creator information from contract events or use current user
      // Note: This is a limitation of the current contract - it doesn't store creator info
      const creators: string[] = [];
      for (let i = 0; i < Number(groupCount); i++) {
        // For now, we'll show the current user as creator if they're connected
        // In a proper implementation, the contract should store creator addresses
        if (address) {
          creators.push(address);
        } else {
          creators.push('Unknown Creator');
        }
      }
      
      // Combine the arrays into objects
      const combinedGroups = names.map((name, index) => ({
        name,
        description: descriptions[index],
        totalAmount: Number(totalAmounts[index]) / 1e18, // Convert to BNB here
        recipients: allRecipients[index] || [],
        creator: creators[index] || 'Unknown',
        groupIndex: index
      }));
      
      setGroups(combinedGroups);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  // Load groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  // Function to fetch group details and show modal
  const viewGroupDetails = async (groupIndex: number) => {
    try {
      setLoading(true);
      
      // Get group details from contract
      const groupDetails = await publicClient.readContract({
        address: GROUP_CONTRACT_ADDRESS as `0x${string}`,
        abi: groupAbi,
        functionName: 'getGroupDetailsById',
        args: [BigInt(groupIndex)]
      }) as any;
      
      console.log('Group details:', groupDetails);
      
      // Combine with the group data we already have
      const group = groups[groupIndex];
      console.log('Group details from contract:', groupDetails);
      console.log('Raw total amount:', groupDetails[2]);
      console.log('Converted total amount:', Number(groupDetails[2]) / 1e18);
      
      // Ensure totalAmount is properly converted from wei to BNB
      const totalAmountInBNB = Number(groupDetails[2]) / 1e18;
      console.log('Final total amount in BNB:', totalAmountInBNB);
      
      const detailedGroup = {
        ...group,
        name: groupDetails[0],
        description: groupDetails[1],
        totalAmount: totalAmountInBNB, // Convert to BNB
        recipients: groupDetails[3] || []
      };
      
      console.log('Final detailed group:', detailedGroup);
      
      setSelectedGroup(detailedGroup);
      setShowGroupDetails(true);
    } catch (err) {
      console.error('Error fetching group details:', err);
      setError('Failed to fetch group details');
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    console.log('Create group called with:', {
      groupName,
      sharedDescription,
      sharedAmount,
      recipientsCount: recipients.length,
      recipients: recipients,
      walletAddress: address
    });
    
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (groupName && sharedDescription && sharedAmount && recipients.length > 0) {
      console.log('All conditions met, proceeding with group creation');
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        // Prepare recipient addresses
        const recipientAddresses = recipients.map(r => r.address as `0x${string}`);
        
        // Calculate total amount in wei
        const totalAmountWei = BigInt(Math.floor(parseFloat(sharedAmount) * 1e18));

        // Simulate the contract call
        const { request } = await publicClient.simulateContract({
          address: GROUP_CONTRACT_ADDRESS as `0x${string}`,
          abi: groupAbi,
          functionName: 'createGroup',
          args: [groupName, sharedDescription, totalAmountWei, recipientAddresses],
          account: address,
        });

        // Write to the contract
        const hash = await walletClient.writeContract(request);
        await publicClient.waitForTransactionReceipt({ hash });

        setSuccess('Group created successfully!');
        setGroupName('');
        setSharedDescription('');
        setSharedAmount('');
        setRecipients([]);
        setFormRecipientInputs([{ id: 1, address: '' }]);
        setShowCreateForm(false);
        
        // Refresh groups list with the new group
        setTimeout(() => {
          fetchGroups();
        }, 2000); // Wait a bit for the transaction to be processed
      } catch (err) {
        console.error('Error creating group:', err);
        setError('Failed to create group. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const addFormRecipient = (inputId: number) => {
    const input = formRecipientInputs.find(inp => inp.id === inputId);
    console.log('Adding recipient:', { input, sharedAmount, sharedDescription });
    
    if (input && input.address && sharedAmount) {
      const newRecipient: Recipient = {
        id: Date.now().toString(),
        address: input.address,
        amount: parseFloat(sharedAmount),
        description: sharedDescription || 'Payment'
      };
      
      setRecipients(prev => {
        const newRecipients = [...prev, newRecipient];
        console.log('Updated recipients:', newRecipients);
        return newRecipients;
      });
      
      // Clear this input
      setFormRecipientInputs(prev => prev.map(inp => 
        inp.id === inputId 
          ? { ...inp, address: '' }
          : inp
      ));
      
      console.log('Recipient added successfully');
    } else {
      console.log('Cannot add recipient:', { 
        hasInput: !!input, 
        hasAddress: input?.address, 
        hasAmount: !!sharedAmount,
        inputAddress: input?.address,
        sharedAmount: sharedAmount
      });
    }
  };

  const addNewFormInput = () => {
    const newId = Math.max(...formRecipientInputs.map(inp => inp.id)) + 1;
    setFormRecipientInputs([...formRecipientInputs, { id: newId, address: '' }]);
  };

  const removeFormInput = (inputId: number) => {
    if (formRecipientInputs.length > 1) {
      setFormRecipientInputs(prev => prev.filter(inp => inp.id !== inputId));
    }
  };

  const updateFormInput = (inputId: number, value: string) => {
    setFormRecipientInputs(prev => prev.map(inp => 
      inp.id === inputId ? { ...inp, address: value } : inp
    ));
  };



  // Sample group data
  const sampleGroup = {
    id: '1',
    name: 'Team Lunch Group',
    description: 'Monthly team lunch payments for the development team. Everyone contributes equally for our team bonding sessions.',
    totalRecipients: 8,
    createdDate: new Date('2024-07-01T10:00:00'),
    totalAmount: 2.5
  };

  const renderGroupCard = (group: any, groupIndex: number) => (
    <div className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 rounded-2xl shadow-2xl p-6 border-t-2 border-l-2 border-r border-b-8 border-t-blue-200 border-l-blue-200 border-r-blue-200 border-b-black max-w-md mx-auto">
      {/* Group Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-black text-blue-900 mb-2" style={{
          textShadow: '-1px 1px 0 #ffffff'
        }}>
          {group.name}
        </h3>
        <p className="text-black font-medium">{group.description}</p>
      </div>

      {/* Group Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-300">
          <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">Total Recipients</span>
          <span className="text-sm font-bold text-blue-900">{group.totalRecipients}</span>
        </div>
      </div>

      {/* Created Date - Small */}
      <div className="text-xs text-black mb-4 text-center">
        Group #{group.groupIndex + 1} • Created recently
      </div>

      {/* View Details Button */}
      <button
        onClick={() => viewGroupDetails(groupIndex)}
        className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 font-bold shadow-lg border-2 border-green-400"
        style={{
          textShadow: '-1px 1px 0 #000000'
        }}
      >
        VIEW DETAILS
      </button>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      {/* Noun Image - Top Left */}
      <div className="absolute top-8 left-8 w-48 h-48 opacity-80 z-10">
        <img
          src="https://noun.pics/1310.png"
          alt="NOUN 1310"
          className="w-full h-full object-contain drop-shadow-2xl rounded-full"
        />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-white" style={{
            textShadow: '-4px 4px 0 #000000',
            WebkitTextStroke: '2px #000000'
          }}>
            GROUP
            <span className="text-yellow-400"> PAYMENT</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-bold max-w-3xl mx-auto">
            Create your payment group and manage recipients with ease
          </p>
        </div>

        {/* Create Group Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-bold text-xl shadow-2xl"
            style={{
              textShadow: '-2px 2px 0 #000000'
            }}
          >
            + CREATE GROUP
          </button>
        </div>

        {/* Create Group Form */}
        {showCreateForm && (
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-blue-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-gray-800" style={{
                textShadow: '-1px 1px 0 #e5e7eb'
              }}>
                CREATE GROUP
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-red-600 text-xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4 font-medium">
              Fill in the group details to create your new payment group
            </p>

            <div className="space-y-4">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-2 uppercase tracking-wide">
                  Group Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Group Description */}
              <div>
                <label className="block text-sm font-bold text-purple-700 mb-2 uppercase tracking-wide">
                  Group Description *
                </label>
                <textarea
                  placeholder="Describe your group"
                  value={sharedDescription}
                  onChange={(e) => setSharedDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-medium text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Shared Amount */}
              <div>
                <label className="block text-sm font-bold text-green-700 mb-2 uppercase tracking-wide">
                  Amount (BNB) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={sharedAmount}
                  onChange={(e) => setSharedAmount(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Recipients Section */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-orange-700 mb-2 uppercase tracking-wide">
                  Recipients *
                </label>
                
                {formRecipientInputs.map((input, index) => (
                  <div key={input.id} className="p-3 border-2 border-orange-200 rounded-lg bg-orange-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-orange-800">Recipient {index + 1}</h4>
                      {formRecipientInputs.length > 1 && (
                        <button
                          onClick={() => removeFormInput(input.id)}
                          className="px-2 py-1 text-orange-600 hover:bg-orange-100 rounded-md transition-colors font-bold text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    
                    {/* Recipient Address */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter wallet address or ENS name"
                        value={input.address}
                        onChange={(e) => updateFormInput(input.id, e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 bg-white text-sm"
                      />
                      <button
                        onClick={() => addFormRecipient(input.id)}
                        disabled={!input.address || !sharedAmount}
                        className={`px-4 py-2 text-white rounded-lg transition-all transform hover:scale-105 font-bold shadow-lg text-sm ${
                          input.address && sharedAmount
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add New Recipient Button */}
                <button
                  onClick={addNewFormInput}
                  className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-bold shadow-lg text-sm"
                >
                  + ADD ANOTHER RECIPIENT
                </button>

                {/* Display Added Recipients */}
                <div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                  <h4 className="text-sm font-bold text-green-800 mb-2">
                    Added Recipients ({recipients.length})
                    {recipients.length === 0 && <span className="text-gray-500 ml-2">(No recipients added yet)</span>}
                  </h4>
                  {recipients.length > 0 ? (
                    <div className="space-y-2">
                      {recipients.map((recipient, index) => (
                        <div key={recipient.id} className="flex justify-between items-center p-2 bg-white border border-green-200 rounded">
                          <span className="text-sm font-mono text-green-700">{recipient.address}</span>
                          <button
                            onClick={() => removeRecipient(recipient.id)}
                            className="px-2 py-1 text-red-600 hover:bg-red-100 rounded text-sm font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic">
                      Add recipients using the form above
                      <br />
                      <button
                        onClick={() => {
                          const testRecipient = {
                            id: Date.now().toString(),
                            address: '0x1234567890123456789012345678901234567890',
                            amount: parseFloat(sharedAmount) || 0.1,
                            description: 'Test recipient'
                          };
                          setRecipients(prev => [...prev, testRecipient]);
                          console.log('Test recipient added manually');
                        }}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs font-bold"
                      >
                        Add Test Recipient (Debug)
                      </button>
                    </div>
                  )}
                </div>


              </div>

              {/* Error and Success Messages */}
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              {success && <p className="text-green-500 text-sm font-medium">{success}</p>}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    console.log('CREATE GROUP button clicked!');
                    console.log('Button state:', {
                      groupName: !!groupName,
                      sharedDescription: !!sharedDescription,
                      sharedAmount: !!sharedAmount,
                      recipientsLength: recipients.length,
                      loading: loading
                    });
                    createGroup();
                  }}
                  disabled={!groupName || !sharedDescription || !sharedAmount || recipients.length === 0 || loading}
                  className={`flex-1 px-4 py-3 text-white rounded-lg transition-all transform hover:scale-105 font-bold shadow-lg ${
                    groupName && sharedDescription && sharedAmount && recipients.length > 0 && !loading
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  style={{
                    textShadow: groupName && sharedDescription && sharedAmount && recipients.length > 0 && !loading ? '-1px 1px 0 #000000' : 'none'
                  }}
                >
                  {loading ? 'CREATING...' : 'CREATE GROUP'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    // Reset form when closing
                    setGroupName('');
                    setSharedDescription('');
                    setSharedAmount('');
                    setRecipients([]);
                    setFormRecipientInputs([{ id: 1, address: '' }]);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all transform hover:scale-105 font-bold shadow-lg"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Groups Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <div key={index}>
                {renderGroupCard({
                  id: index.toString(),
                  name: group.name,
                  description: group.description,
                  totalRecipients: group.recipients?.length || 0,
                  createdDate: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Simulate creation time based on index
                  totalAmount: group.totalAmount,
                  creator: group.creator,
                  groupIndex: group.groupIndex
                }, index)}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-white/80 text-xl font-medium">
                No groups created yet. Create your first group!
              </p>
            </div>
          )}
        </div>

        {/* Group Details Modal */}
        {showGroupDetails && selectedGroup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pt-20">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-blue-300 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-gray-800" style={{
                  textShadow: '-1px 1px 0 #e5e7eb'
                }}>
                  GROUP DETAILS
                </h2>
                <button
                  onClick={() => setShowGroupDetails(false)}
                  className="text-gray-500 hover:text-red-600 text-xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Owner Information */}
              <div className="mb-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">
                  Owner: {selectedGroup.creator && selectedGroup.creator.startsWith('0x')
                    ? `${selectedGroup.creator.slice(0, 6)}...${selectedGroup.creator.slice(-4)}`
                    : selectedGroup.creator || 'Unknown Creator'
                  }
                </p>
              </div>

              {/* Total Amount */}
              <div className="mb-4 p-3 bg-green-100 rounded-lg border border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-green-700 uppercase tracking-wide">Total Amount:</span>
                  <span className="text-lg font-bold text-green-900">
                    {selectedGroup.totalAmount !== undefined && selectedGroup.totalAmount !== null
                      ? (typeof selectedGroup.totalAmount === 'number' 
                          ? selectedGroup.totalAmount.toFixed(2) 
                          : Number(selectedGroup.totalAmount).toFixed(2)
                        )
                      : '0.00'
                    } BNB
                  </span>
                </div>
              </div>

              {/* Recipients List */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Recipients ({selectedGroup.recipients?.length || 0})</h4>
                {selectedGroup.recipients && selectedGroup.recipients.length > 0 ? (
                  <div className="space-y-2">
                    {selectedGroup.recipients.map((recipient: string, index: number) => (
                      <div key={index} className="p-3 bg-white border-2 border-green-200 rounded-lg">
                        <span className="text-sm font-mono text-green-700 bg-green-100 px-2 py-1 rounded">
                          {recipient}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recipients found</p>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowGroupDetails(false)}
                  className="px-6 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all transform hover:scale-105 font-bold shadow-lg"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;