"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/app/hooks/use-outside-click";


interface EmployeeProfile {
  name: string;
  title: string;
  description: string;
}

const EmployeeProfileCard: React.FC<EmployeeProfile & { id: string; onSelect: () => void }> = ({ name, title, id, onSelect }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <motion.div
      layoutId={`card-${name}-${id}`}
      onClick={onSelect}
      className="flex items-center space-x-3 cursor-pointer"
    >
      <motion.div layoutId={`image-${name}-${id}`} className="flex-shrink-0">
        <div className="w-[60px] h-[60px] rounded-md bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
          {initials}
        </div>
      </motion.div>
      <div>
        <motion.h3
          layoutId={`name-${name}-${id}`}
          className="font-medium text-gray-800"
        >
          {name}
        </motion.h3>
        <motion.p
          layoutId={`title-${name}-${id}`}
          className="text-sm text-gray-600"
        >
          {title}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Add this interface
interface Contact {
  title: string;
  department: string;
  subDepartment?: string;
  emailsFound: number;
  phoneNumbersFound?: number;
}

export default function CompanyPeople({ company }: { company: any }) {
  const [active, setActive] = useState<EmployeeProfile | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const contactsRef = useRef<HTMLDivElement>(null);
  const employeeProfilesRef = useRef<HTMLDivElement>(null);
  const boardMembersRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const employees: EmployeeProfile[] = [
    { name: "Jane Fraser", title: "CEO", description: "Jane Fraser is the Chief Executive Officer of Citi, and the first woman to lead a major Wall Street bank." },
    { name: "Brent McIntosh", title: "CLO and Corporate Secretary", description: "Brent McIntosh serves as Citi's Chief Legal Officer and Corporate Secretary, overseeing the company's legal affairs worldwide." },
    { name: "Cece Stewart", title: "President", description: "Cece Stewart is the President of Citi, responsible for the company's global consumer banking operations." },
    { name: "Mark Mason", title: "CFO", description: "Mark Mason is Citi's Chief Financial Officer, overseeing the company's financial planning and analysis." },
    { name: "Anand Selvakesari", title: "COO", description: "Anand Selvakesari is the Chief Operating Officer of Citi, managing the bank's global operations and technology." },
    { name: "David Livingstone", title: "CCO", description: "David Livingstone serves as Citi's Chief Compliance Officer, ensuring the bank's adherence to regulatory requirements." },
    { name: "Zdenek Turek", title: "CRO", description: "Zdenek Turek is Citi's Chief Risk Officer, responsible for the company's global risk management framework." },
    { name: "Sara Wechter", title: "CHRO", description: "Sara Wechter is the Chief Human Resources Officer at Citi, overseeing the bank's global workforce strategies." },
  ];

  // Add this contacts array
  const contacts: Contact[] = [
    { title: "Example Contact", department: "Sales", emailsFound: 1 },
    // ... more contacts ...
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Highlights Card */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Highlights</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div 
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => scrollToSection(employeeProfilesRef)}
          >
            <h3 className="text-sm text-gray-600 mb-1">Employee Profiles</h3>
            <p className="text-2xl font-bold text-blue-600">{company.employeeProfiles}</p>
            <div className="flex justify-end mt-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div 
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => scrollToSection(boardMembersRef)}
          >
            <h3 className="text-sm text-gray-600 mb-1">Number of Board Member and Advisor Profiles</h3>
            <p className="text-2xl font-bold text-blue-600">{company.boardMemberProfiles}</p>
            <div className="flex justify-end mt-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div 
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => scrollToSection(contactsRef)}
          >
            <h3 className="text-sm text-gray-600 mb-1">Contacts</h3>
            <p className="text-2xl font-bold text-blue-600">{company.contacts}</p>
            <div className="flex justify-end mt-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
          <p className="text-sm text-gray-600 mb-2">
            {company.name} has {company.employeeProfiles} current employee profiles, including CEO {company.ceo}.
          </p>
          <p className="text-sm text-gray-600">
            {company.name} has {company.boardMemberProfiles} board members and advisors, including {company.ceo}.
          </p>
        </div>
      </div>

      {/* Contacts Card */}
      <div ref={contactsRef} className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Contacts</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
            <option>Job Departm...</option>
          </select>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search Contacts..."
              className="w-full border border-gray-300 rounded-md pl-8 pr-2 py-1 text-sm"
            />
            <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <ul className="space-y-4">
          {contacts.map((contact, index) => (
            <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <svg className="h-5 w-5 text-blue-600 mt-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-800">{contact.title}</h3>
                    <p className="text-sm text-gray-600">{contact.department}</p>
                    {contact.subDepartment && (
                      <p className="text-sm text-gray-600">{contact.subDepartment}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-sm text-gray-600">
                    <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {contact.emailsFound} email found
                  </div>
                  {contact.phoneNumbersFound && (
                    <div className="text-sm text-gray-600">
                      <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {contact.phoneNumbersFound} phone number{contact.phoneNumbersFound > 1 ? 's' : ''} found
                    </div>
                  )}
                  <button className="bg-orange-400 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-orange-500 transition-colors">
                    VIEW
                  </button>
                </div>
              </div>
              <div className="flex space-x-2 mt-2">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
                                </svg>
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                </svg>
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.256-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.44 1.44-1.44.795 0 1.44.646 1.44 1.44z"></path>
                </svg>
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Employee Profiles Card */}
      <div ref={employeeProfilesRef} className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Employee Profiles</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-700">Number of Employee Profiles</p>
          <p className="text-2xl font-bold text-gray-800">{company.employeeProfiles}</p>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          {company.name} has {company.employeeProfiles} current employee profiles, including CEO {company.ceo}.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {employees.map((employee) => (
            <EmployeeProfileCard
              key={employee.name}
              {...employee}
              id={id}
              onSelect={() => setActive(employee)}
            />
          ))}
        </div>
        <button className="w-full text-center py-2 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 5L21 12M21 12L13 19M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          SHOW MORE
        </button>
      </div>

      {/* Board Members Card */}
      <div ref={boardMembersRef} className="bg-white rounded-lg shadow-md p-5">
        {/* Add Board Members content here */}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.name}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.name}-${id}`}>
                <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-6xl">
                  {active.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              </motion.div>

              <div className="p-4">
                <motion.h3
                  layoutId={`name-${active.name}-${id}`}
                  className="font-bold text-xl text-gray-800"
                >
                  {active.name}
                </motion.h3>
                <motion.p
                  layoutId={`title-${active.name}-${id}`}
                  className="text-gray-600"
                >
                  {active.title}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-gray-700"
                >
                  {active.description}
                </motion.p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};