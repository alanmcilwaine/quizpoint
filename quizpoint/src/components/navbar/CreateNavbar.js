/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { user } from '../firebase/fb.user';
import { Fragment } from 'react'
import Logo from '../../media/logo.svg'

const CreateNavbar = (props) => {
    let navigation;
    // eslint-disable-next-line default-case
    switch (props.role) {
        // Changes the navigation depending on the role of the user
        case 'teacherHome':
            navigation = [
                { name: 'Your Classes', href: '/classes', current: true },
                { name: 'Teaching Suite', href: '/tcs', current: false },
            ]
            break;
        case 'student':
            navigation = [
                { name: 'Your Classes', href: '/classes', current: true },
            ]
            break;
        case 'teachingSuite':
            navigation = [
                { name: 'Students', href: '/tcs/students/all', current: false },
                { name: 'Teachers', href: '/tcs/teachers/all', current: false },
                { name: 'Classes', href: '/tcs/classes', current: false },
                { name: 'Quizzes', href: '/tcs/quizzes', current: false },
                { name: 'Report', href: '/tcs/reporting', current: false },
                { name: 'Settings', href: '/tcs/setup', current: false },
            ]
    }


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    function updateCurrentInNavigationArray(itemClicked) {
        navigation.forEach(item => {
            if (item.current) {
                item.current = false
            }
            console.log(item)
        }
        )
        itemClicked.current = true;
    }
    return (
        <Disclosure as="nav" className="bg-indigo-900">
            {({ open }) => (
                <>
                    <div className="mx-auto px-3 py-2 sm:px-6 lg:px-8 max-w-[85%]">
                        <div className="relative flex items-center justify-between h-16">
                            {/* Mobile Navigation Button */}
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-slate-50 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {/* Change Icon If Dropdown is Opened */}
                                    {open ? (
                                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>

                            <div className=" items-start hidden sm:block">
                                <a href="/classes"><img className="w-auto h-12" src={Logo} alt="Quizpoint Logo" /></a>
                            </div>

                            {/* Main Desktop Content */}
                            <div className="flex-1 flex items-center content-center justify-center sm:items-stretch">
                                {/* Logo */}
                                <div className="hidden sm:block bg-indigo-900 rounded-lg">
                                    <div className="flex space-x-4 border-slate-300 border p-2 rounded-lg shadow-md">
                                        {/* Generate a new navigation button for each in array navigation */}
                                        {navigation.map((item) => (
                                            <a
                                                onClick={() => updateCurrentInNavigationArray(item)}
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'font-bold' : 'font-medium',
                                                    'px-4 py-2 text-sm m-0 last:mr-0 border-r last:border-0 text-white relative after:absolute after:bg-gray-200 after:bottom-0 after:left-0 after:h-[1px] after:w-full after:translate-y-1 after:opacity-0 hover:after:translate-y-0 hover:after:opacity-100 after:transition after:ease-in-out after:duration-200',
                                                )}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>



                            {/* Desktop Profile dropdown */}
                            <div className="flex items-end">
                                <Menu as="div" className="relative">
                                    <div className="flex align-center ">
                                        <Menu.Button className="p-0">
                                            <span className="sr-only">Open user menu</span>
                                            <img className="w-12 h-12 rounded-lg" src={user.picture} alt="Profile Picture" />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="/user/"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Your Profile
                                                    </a>
                                                )}
                                            </Menu.Item>

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="/logout"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Sign Out
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                <Disclosure.Button

                                    onClick={() => updateCurrentInNavigationArray()}

                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block px-3 py-2 rounded-md text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}

export default CreateNavbar;
