"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConnectWallet from './connect-wallet';
import { useAccount } from 'wagmi';

const NAV_ITEMS = [
    { name: 'Transfer', path: '/transfer' },
    { name: 'Liquidity', path: '/liquidity' },
    { name: 'Swap', path: '/swap' },
];

export default function TopNav() {
    const account = useAccount()
    const pathname = usePathname()

    return (
        <nav className="bg-black text-white p-4 sticky top-0 border-b-white border-b-2">
            <div className="container mx-auto flex justify-between items-center">
                <Link href={"/"}>
                    <h1 className="text-xl font-bold">DeFi Application</h1>
                </Link>
                {
                    account.isConnected &&
                    <ul className='flex flex-row flex-1 mx-8'>
                        {NAV_ITEMS.map((item) => (
                            <li key={item.path}>
                                <Link href={item.path}>
                                    <span
                                        className={`
                                    cursor-pointer hover:underline mr-4
                                    ${pathname !== '/' && item.path.startsWith(pathname) ? 'font-bold underline' : ''}
                                    `}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                }
                <ConnectWallet />
            </div>
        </nav >
    );
};
