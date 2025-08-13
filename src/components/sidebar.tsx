import React from "react";
import CalendarClient from "../components/calendar-client";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

const museoModerno = localFont({
    src: '../../public/fonts/MuseoModerno-SemiBold.woff2',
    weight: '600',
    display: 'swap',
})

export default function Sidebar() {
    return (
        <aside className="flex flex-col justify-between bg-indigo-600 text-white w-64 h-screen p-4">
            {/* Top: logo + title */}
            <div className="flex flex-col items-center space-y-2 mt-4 mb-8">
                <Image
                    src="/images/technology.png"
                    alt="MyManageHub Logo"
                    width={96}
                    height={96}
                />
                <span className={`${museoModerno.className} text-base font-semibold`}>MyManageHub</span>
            </div>

            {/* Middle: nav links */}
            <nav className="flex-grow">
                <ul className="space-y-4">
                    {['Matriz', 'Calendario', 'Busqueda', 'Usuario'].map((label) => (
                        <li key={label}>
                            <Link href={`/${label.toLowerCase()}`}
                            className="block py-2 px-3 font-semibold text-center uppercase rounded hover:bg-slate-900">
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom: calendar placeholder */}
            <div>
                <CalendarClient />
            </div>
        </aside>
    );
}