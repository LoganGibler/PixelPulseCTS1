import React, { useState, useEffect } from "react";
import { GrUpdate } from "react-icons/gr";
import { BiSort } from "react-icons/bi";
import { AiOutlineTeam } from "react-icons/ai";
import { BsSortUpAlt } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { getTeamsTickets } from "../api/tickets";
import { TbExchange } from "react-icons/tb";
import { TbAlertTriangle } from "react-icons/tb";
import { useNavigate } from "react-router";
import moment from "moment";

const ChangeDashboard = ({ userData }) => {
  const navigate = useNavigate();
  const [changeTickets, setChangeTickets] = useState([]);
  const [sort, setSort] = useState(false);

  async function fetchChangeTickets(type, userData) {
    // will need to change query to only query changes being implemented during the period, aka- January 1st - january 7th
    const tickets = await getTeamsTickets(type, userData);
    if (tickets === undefined || tickets.length === 0) {
      return;
    }
    const sortedTickets = tickets.sort(
      (a, b) =>
        moment(a.implementationStart).toDate() -
        moment(b.implementationStart).toDate()
    );
    setChangeTickets(sortedTickets);
  }

  const formatTimestamp = (timestamp) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "EST",
    };
    return new Date(timestamp).toLocaleString("en-US", options);
  };

  const sortByDate = async () => {
    setSort(!sort);
    const sortedTickets = changeTickets.sort(
      (a, b) =>
        moment(a.implementationStart).toDate() -
        moment(b.implementationStart).toDate()
    );
    if (sort) {
      setChangeTickets(sortedTickets.reverse());
    } else {
      setChangeTickets(sortedTickets);
    }
  };

  useEffect(() => {
    fetchChangeTickets("Change", userData);
  }, [userData]);

  return (
    <div className="flex flex-col text-white grow md:border-l-8 border-slate-700">
      <div className="bg-slate-700 px-2 py-2 flex">
        <TbExchange className="text-lg mt-1" />
        <p className="font-semibold pl-2">Changes This Week</p>
        <div className="flex grow justify-end">
          <BiSort
            className="text-lg mt-[2px] mr-1 hover:cursor-pointer"
            onClick={sortByDate}
          />

          <GrUpdate
            className="mr-1 mt-[3px] ml-1 hover:cursor-pointer"
            onClick={() => fetchChangeTickets("Change", userData)}
          />
        </div>
      </div>

      <div className="max-h-[650px] overflow-y-scroll">
        {changeTickets ? (
          changeTickets.map((ticket, index) => {
            if (index % 2 === 0) {
              var elementClassname =
                "flex flex-col text-sm px-3 py-3 border-b-[1px] text-black hover:cursor-pointer";
            } else {
              var elementClassname =
                "flex flex-col text-sm px-3 py-3 border-b-[1px] text-black hover:cursor-pointer bg-gray-200";
            }
            const ticketStartDate = formatTimestamp(ticket.implementationStart);

            return (
              <div
                key={index}
                className={elementClassname}
                onClick={() => navigate("/ticket/" + ticket.ticketNumber)}
              >
                <div className="flex overflow-hidden text-ellipsis">
                  <p>#{ticket.ticketNumber}</p>
                  <p className="truncated-text-sm pl-3 overflow-hidden font-semibold">
                    {ticket.title}
                  </p>
                </div>

                <div className="flex mt-2.5 text-sm">
                  <p className="text-blue-700 whitespace-nowrap">
                    Start: <span className="text-black">{ticketStartDate}</span>
                  </p>
                  <div className="grow justify-end hidden sm:flex">
                    <p className="text-blue-700">
                      {ticket.involvedTeams.map((team, index) => {
                        return (
                          <span
                            key={index}
                            className="text-black px-1.5 border-r-[2px] border-green-500"
                          >
                            {team}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>

                {ticket.elevatedAccess ? (
                  <div className="flex mt-2.5 text-xs text-red-600">
                    <TbAlertTriangle className="text-base mt-[2px] mr-2" />
                    <p className="mt-[1px]">
                      This change requires elevated access.
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="text-black flex justify-center text-sm py-3">
            <div>No active changes this week.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeDashboard;