"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/app/hooks/use-outside-click";
import { getEmployeesByCompanyId } from "@/lib/actions/company.actions";

interface EmployeeProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  position?: string;
  bio?: string;
  photoUrl?: string;
}

interface Contact {
  title: string;
  department: string;
  subDepartment?: string;
  emailsFound: number;
  phoneNumbersFound?: number;
}

export default function CompanyPeople({ company }: { company: any }) {
  const [active, setActive] = useState<EmployeeProfile | null>(null);
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const contactsRef = useRef<HTMLDivElement>(null);
  const employeeProfilesRef = useRef<HTMLDivElement>(null);
  const boardMembersRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  // Fetch employees by company ID on mount or when company._id changes
  useEffect(() => {
    if (!company?._id) return;

    setLoading(true);
    setError(null);

    getEmployeesByCompanyId(company._id)
      .then((fetchedEmployees) => {
        setEmployees(fetchedEmployees);
      })
      .catch((err) => {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load employees");
      })
      .finally(() => setLoading(false));
  }, [company?._id]);

  // Example contacts array (can be dynamic too)
  const contacts: Contact[] = [
    { title: "Example Contact", department: "Sales", emailsFound: 1 },
    // Add more contacts as needed...
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Highlights Card */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Highlights</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
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
            <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
            <div className="flex justify-end mt-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
          <p className="text-sm text-gray-600 mb-2">
            {company.name} has {employees.length} current employee profiles, including CEO {company.owners}.
          </p>
          <p className="text-sm text-gray-600">
            {company.name} has {company.boardMemberProfiles} board members and advisors, including {company.ceo}.
          </p>
        </div>
      </div>

      {/* Employee Profiles List */}
      <div ref={employeeProfilesRef} className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-bold mb-4">Employee Profiles</h2>
        {loading && <p>Loading employees...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && employees.length === 0 && <p>No employees found.</p>}
        <ul className="space-y-4">
  {employees.map((emp) => (
    <li key={emp._id}>
      <EmployeeProfileCard
        id={emp._id}
        photoUrl={emp.photoUrl ?? ""}
        name={`${emp.title ? emp.title + " " : ""}${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim()}
        title={emp.position ?? "No title"}
        onSelect={() => setActive(emp)}
      />
    </li>
  ))}
</ul>
      </div>

      {/* Contacts Card */}
      <div ref={contactsRef} className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Contacts</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {contacts.map((contact, idx) => (
            <div
              key={`${contact.title}-${idx}`}
              className="p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-800">{contact.title}</h3>
              <p className="text-sm text-gray-600">
                Department: {contact.department} {contact.subDepartment && ` - ${contact.subDepartment}`}
              </p>
              <p className="text-sm text-gray-600">
                Emails Found: {contact.emailsFound}
                {contact.phoneNumbersFound !== undefined && `, Phones Found: ${contact.phoneNumbersFound}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal or Details for Active Employee */}
      <AnimatePresence>
       {active && (
  <motion.div
    ref={ref}
    key="modal"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <motion.div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
      <button
        onClick={() => setActive(null)}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
      >
        &times;
      </button>
      <div className="flex flex-col items-center mb-4">
          <img
            src={active.photoUrl || "https://avatar.iran.liara.run/public/boy"}
            alt={`${active.firstName} ${active.lastName}`}
            className="w-24 h-24 rounded-full object-cover border border-gray-300 mb-2"
          />
          <h2 className="text-xl font-bold text-center">
            {`${active.title ? active.title + " " : ""}${active.firstName ?? ""} ${active.lastName ?? ""}`.trim()}
          </h2>
        </div>

      <p className="text-gray-700 mb-2">{ active.position ?? "No title"}</p>
      <p className="text-gray-600">{active.bio || "No biography available."}</p>

    </motion.div>
  </motion.div>
)}
      </AnimatePresence>
    </div>
  );
}

function EmployeeProfileCard({
  id,
  photoUrl,
  name,
  title,
  onSelect,
}: {
  id: string;
  photoUrl: string;
  name: string;
  title: string;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="border border-gray-300 rounded p-4 cursor-pointer hover:bg-gray-100 transition"
      tabIndex={0}
      role="button"
      aria-pressed="false"
      aria-label={`View details for ${name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
       <img
        src={photoUrl || "https://avatar.iran.liara.run/public/boy"}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <h3 className="font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );
}
