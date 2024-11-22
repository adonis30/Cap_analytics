'use client';

import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getAllCompanies } from "@/lib/actions/company.actions";
import { useOutsideClick } from "@/app/hooks/use-outside-click";

export function Collections() {
  const [active, setActive] = useState<any | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [showMoreCategories, setShowMoreCategories] = useState<Record<string, boolean>>({});

  // Fetch companies' data from companies.action.tsx on component mount
  useEffect(() => {
    async function loadCompanies() {
      try {
        const response = await getAllCompanies({ query: '', category: '', limit: 10, page: 1 });
        setCompanies(response?.data || []);
      //  console.log(response?.data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setCompanies([]);
      }
    }

    loadCompanies();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handleToggleCategories = (companyId: string) => {
    setShowMoreCategories((prevState) => ({
      ...prevState,
      [companyId]: !prevState[companyId],
    }));
  };

  return (
    <>
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
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active._id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active._id}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active._id}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.imageUrl}
                  alt={active.organizationName}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active._id}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.organizationName}
                    </motion.h3>
                    <motion.p
                      layoutId={`category-${active._id}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {/* Display the first category */}
                      {active.categories.length > 0 ? (
                        <>
                          Category: {active.categories[0]?.name}
                          {active.categories.length > 1 && (
                            <>
                              {showMoreCategories[active._id] ? (
                                active.categories.slice(1).map((cat: any, idx: number) => (
                                  <span key={idx}> {`, ${cat.name}`}</span>
                                ))
                              ) : (
                                <span> and {active.categories.length - 1} more</span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleCategories(active._id);
                                }}
                                className="text-blue-500 underline ml-1"
                                aria-label={showMoreCategories[active._id] ? "View less categories" : "View more categories"}
                              >
                                {showMoreCategories[active._id] ? 'View Less' : 'View More'}
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        'No Category'
                      )}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active._id}-${id}`}
                    href={`/companies/${active._id}`}
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                    aria-label="View company details"
                  >
                    View Details
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {active.description} {/* Changed to 'description' for clarity */}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="max-w-2xl mx-auto w-full gap-4">
        {companies.map((company) => (
          <motion.div
            layoutId={`card-${company._id}-${id}`}
            key={`card-${company._id}-${id}`}
            onClick={() => setActive(company)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row">
              <motion.div layoutId={`image-${company._id}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={company.imageUrl}
                  alt={company.organizationName}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${company._id}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {company.organizationName}
                </motion.h3>
                <motion.p
                  layoutId={`category-${company._id}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {Array.isArray(company.categories) && company.categories.length > 0 ? (
                    <>
                      {company.categories[0]?.name}
                      {company.categories.length > 1 && (
                        <>
                          {showMoreCategories[company._id] ? (
                            company.categories.slice(1).map((cat: any, idx: number) => (
                              <span key={idx}>{`, ${cat.name}`}</span>
                            ))
                          ) : (
                            <span> and {company.categories.length - 1} more</span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCategories(company._id);
                            }}
                            className="text-blue-500 underline ml-1"
                            aria-label={showMoreCategories[company._id] ? "View less categories" : "View more categories"}
                          >
                            {showMoreCategories[company._id] ? 'View Less' : 'View More'}
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    'No Category'
                  )}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${company._id}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-green-500 text-white"
              aria-label="View company details"
            >
              View Details
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
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
