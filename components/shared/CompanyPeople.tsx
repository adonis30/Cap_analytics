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

interface Contact {
  title: string;
  department: string;
  subDepartment?: string;
  emailsFound: number;
  phoneNumbersFound?: number;
}

export default function CompanyPeople({ company, fetchedEmployees }: { company: any; fetchedEmployees: EmployeeProfile[] }) {
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

    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const contacts: Contact[] = [
    { title: "Example Contact", department: "Sales", emailsFound: 1 },
  ];

  return (
    <div className="space-y-5 font-sans">
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Highlights</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div 
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => scrollToSection(employeeProfilesRef)}
          >
            <h3 className="text-sm text-gray-600 mb-1">Employee Profiles</h3>
            <p className="text-2xl font-bold text-blue-600">{company.employeeProfiles}</p>
          </div>
          <div 
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => scrollToSection(boardMembersRef)}
          >
            <h3 className="text-sm text-gray-600 mb-1">Board Members & Advisors</h3>
            <p className="text-2xl font-bold text-blue-600">{company.boardMemberProfiles}</p>
          </div>
          <div 
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => scrollToSection(contactsRef)}
          >
            <h3 className="text-sm text-gray-600 mb-1">Contacts</h3>
            <p className="text-2xl font-bold text-blue-600">{company.contacts}</p>
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

      {/* Contacts */}
      <div ref={contactsRef} className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Contacts</h2>
        <ul className="space-y-4">
          {contacts.map((contact, index) => (
            <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <svg className="h-5 w-5 text-blue-600 mt-1" fill="currentColor" viewBox="0 0 24 24">
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
                <div className="text-sm text-gray-600">
                  <span>{contact.emailsFound} email found</span>
                  {contact.phoneNumbersFound && <span>, {contact.phoneNumbersFound} phone number(s)</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Employee Profiles */}
      <div ref={employeeProfilesRef} className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Employee Profiles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetchedEmployees.map((employee, index) => (
            <EmployeeProfileCard
              key={index}
              id={`${index}`}
              name={employee.name}
              title={employee.title}
              description={employee.description}
              onSelect={() => setActive(employee)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            ref={ref}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div layoutId={`card-${active.name}-${id}`} className="bg-white p-6 rounded-md max-w-lg w-full">
              <motion.h2 layoutId={`name-${active.name}-${id}`} className="text-xl font-semibold text-gray-800">
                {active.name}
              </motion.h2>
              <motion.h3 layoutId={`title-${active.name}-${id}`} className="text-md text-gray-600">
                {active.title}
              </motion.h3>
              <motion.p className="text-sm text-gray-700 mt-4">
                {active.description}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
