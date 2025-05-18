"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/app/hooks/use-outside-click";
import { getEmployeesByInvestorId } from "@/lib/actions/investor.actions";

interface InvestorTeamMember {
  _id: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  role?: string;
  bio?: string;
}

interface Contact {
  title: string;
  department: string;
  subDepartment?: string;
  emailsFound: number;
  phoneNumbersFound?: number;
}

export default function InvestorProfiles({ investor }: { investor: any }) {
  const [active, setActive] = useState<InvestorTeamMember | null>(null);
  const [team, setTeam] = useState<InvestorTeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const contactsRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  useEffect(() => {
    if (!investor?._id) return;

    setLoading(true);
    setError(null);

    getEmployeesByInvestorId(investor._id)
      .then(setTeam)
      .catch((err) => {
        console.error("Failed to fetch team:", err);
        setError("Failed to load team members");
      })
      .finally(() => setLoading(false));
  }, [investor?._id]);

  const contacts: Contact[] = [
    { title: "Investment Partner", department: "Private Equity", emailsFound: 2 },
    // Add more dynamic data if needed
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Highlights */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Highlights</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <HighlightCard
            label="Team Members"
            count={team.length}
            onClick={() => scrollToSection(teamRef)}
          />
          <HighlightCard
            label="Board Members"
            count={investor.boardRoles}
            onClick={() => scrollToSection(boardRef)}
          />
          <HighlightCard
            label="Contacts"
            count={investor.contacts}
            onClick={() => scrollToSection(contactsRef)}
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
          <p className="text-sm text-gray-600">
            {investor.name} has {team.length} listed investment professionals including Managing Partner {investor.owners}.
          </p>
          <p className="text-sm text-gray-600">
            {investor.name} includes {investor.boardRoles} board/advisory roles including {investor.ceo}.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div ref={teamRef} className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-bold mb-4">Team Members</h2>
        {loading && <p>Loading team members...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && team.length === 0 && <p>No team members found.</p>}
        <ul className="space-y-4">
          {team.map((member) => (
            <li key={member._id}>
              <TeamProfileCard
                id={member._id}
                name={`${member.title ? member.title + " " : ""}${member.firstName ?? ""} ${member.lastName ?? ""}`.trim()}
                role={member.role ?? "No role"}
                onSelect={() => setActive(member)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Contacts Section */}
      <div ref={contactsRef} className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Contacts</h2>
        <div className="space-y-2">
          {contacts.map((c, i) => (
            <div key={`${c.title}-${i}`} className="p-2 border border-gray-200 rounded hover:bg-gray-50">
              <h3 className="font-semibold text-gray-800">{c.title}</h3>
              <p className="text-sm text-gray-600">
                Department: {c.department}
                {c.subDepartment && ` - ${c.subDepartment}`}
              </p>
              <p className="text-sm text-gray-600">
                Emails Found: {c.emailsFound}
                {c.phoneNumbersFound !== undefined && `, Phones Found: ${c.phoneNumbersFound}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Member Details */}
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
              <button onClick={() => setActive(null)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
                &times;
              </button>
              <h2 className="text-xl font-bold mb-2">
                {`${active.title ?? ""} ${active.firstName ?? ""} ${active.lastName ?? ""}`.trim()}
              </h2>
              <p className="text-gray-700 mb-2">{active.role ?? "No role"}</p>
              <p className="text-gray-600">{active.bio || "No biography available."}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HighlightCard({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <div
      className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      <h3 className="text-sm text-gray-600 mb-1">{label}</h3>
      <p className="text-2xl font-bold text-blue-600">{count}</p>
      <div className="flex justify-end mt-2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

function TeamProfileCard({
  id,
  name,
  role,
  onSelect,
}: {
  id: string;
  name: string;
  role: string;
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
      <h3 className="font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
}
