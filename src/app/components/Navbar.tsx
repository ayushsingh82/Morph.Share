'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="text-white text-2xl font-bold hover:text-yellow-300 transition-colors">
            Friend.Share
          </Link>
        </div>
   
{/*        
          <ConnectButton /> */}
       
        {/* Center: Navigation Links with Yellow Background */}
        <div className="hidden md:flex justify-center space-x-4">
          <Link href="/group" className="bg-yellow-300 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-semibold">
            Group
          </Link>
          <Link href="/events" className="bg-yellow-300 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-semibold">
            Events
          </Link>
          <Link href="/reminder" className="bg-yellow-300 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-semibold">
            Reminder
          </Link>
        </div>
      
        {/* Right: ConnectButton with Custom Styling */}
        <div className="flex-1 flex justify-end">
          <div className="relative z-[9999]">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div className="flex items-center space-x-4">
                    {connected ? (
                      <div className="flex items-center space-x-3">
                        <div className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2 flex items-center space-x-3 shadow-lg">
                          <span className="text-sm font-semibold text-gray-700">
                            {account.address.slice(0, 6)}...{account.address.slice(-4)}
                          </span>
                          <span className="text-blue-600 font-bold">
                            {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                          </span>
                        </div>
                        <button
                          onClick={openAccountModal}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold border-2 border-black shadow-lg text-sm"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={openConnectModal}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold border-2 border-black shadow-lg"
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


