import { useEffect, useState, useCallback } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { toast } from 'sonner';
import Navbar from './Navbar';

import bannerImg from '../assets/banner.jpg';
import vectorImg from '../assets/vector.png';
import unionImg from '../assets/union.png';

const getTodayISO = () => new Date().toISOString().split('T')[0];
const getTimeNow = () => new Date().toTimeString().slice(0, 5);

export default function DTR() {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;
  const maxRecords = 100;
  const today = getTodayISO();
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  // fetching the user's attendance records
  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3000/timeRecords');
      const data = await res.json();
      setRecords(
        data
          .filter((r) => r.employeeId === user.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, maxRecords)
      );
    } catch {
      toast.error('Unable to load attendance records.');
    }
  }, [user.id]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleTimeIn = async () => {
    try {
      await fetch('http://localhost:3000/timeRecords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: user.id,
          date: today,
          timeIn: getTimeNow(),
          timeOut: '',
        }),
      });
      toast.success('Time‑in recorded 👍');
      fetchRecords();
    } catch {
      toast.error('Failed to time‑in. Please try again.');
    }
  };

  const handleTimeOut = async (todayRecId) => {
    try {
      await fetch(`http://localhost:3000/timeRecords/${todayRecId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeOut: getTimeNow() }),
      });
      toast.success('Time‑out recorded 👋');
      fetchRecords();
    } catch {
      toast.error('Failed to time‑out. Please try again.');
    }
  };

  const todayRec = records.find((r) => r.date === today);
  const hasIn = !!todayRec?.timeIn;
  const hasOut = !!todayRec?.timeOut;

  let mainBtnLabel = 'Time In';
  let mainBtnAction = handleTimeIn;
  let mainBtnDisabled = false;

  if (hasIn && !hasOut) {
    mainBtnLabel = 'Time Out';
    mainBtnAction = () => handleTimeOut(todayRec.id);
  } else if (hasOut) {
    mainBtnLabel = 'Done';
    mainBtnDisabled = true;
  }

  const totalPages = Math.ceil(records.length / perPage);
  const pageData = records.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const bannerStyle = {
    backgroundImage: `url(${bannerImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <>
      <Navbar />

      <main className="px-4 lg:px-10 py-8 bg-page min-h-screen">
        <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-3">
          <div className="bg-white rounded-2xl shadow lg:col-span-2">
            <div
              style={bannerStyle}
              className="relative rounded-t-2xl p-4 flex items-center justify-between"
            >
              <img
                src={vectorImg}
                alt=""
                className="absolute left-4 top-1/2 -translate-y-1/2 w-24 sm:w-28 lg:w-32 opacity-30 pointer-events-none select-none"
              />
              <h2 className="text-white font-semibold relative">
                My Attendance
              </h2>
              <ConfirmButton
                label={mainBtnLabel}
                onConfirm={mainBtnAction}
                disabled={mainBtnDisabled}
              />
            </div>

            <AttendanceTable data={pageData} />

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 py-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-8 w-8 rounded text-sm ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <LeaveCreditsCard bannerStyle={bannerStyle} />
        </div>
      </main>
    </>
  );
}

function ConfirmButton({ label, onConfirm, disabled = false }) {
  if (disabled) {
    return (
      <button
        className="bg-gray-300 text-gray-500 text-sm font-semibold px-4 py-1 rounded cursor-not-allowed"
        disabled
      >
        {label}
      </button>
    );
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="bg-white text-indigo-700 text-sm font-semibold px-4 py-1 rounded">
          {label}
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fade" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <AlertDialog.Title className="text-lg font-semibold">
            {label}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 mb-4 text-sm">
            Are you sure you want to {label.toLowerCase()}?
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">
            <AlertDialog.Cancel className="px-4 py-2 rounded border">
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action
              className="px-4 py-2 rounded bg-[color:var(--color-primary)] text-white"
              onClick={onConfirm}
            >
              Yes
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

// Attendance Table
function AttendanceTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Time In</th>
            <th className="p-3 text-left">Time Out</th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.timeIn || '-'}</td>
                <td className="p-3">{r.timeOut || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No records yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Leave Credits on the right side
function LeaveCreditsCard({ bannerStyle }) {
  const credits = [
    ['Vacation', 7],
    ['Sick', 5],
    ['Bereavement', 3],
    ['Emergency Leave', 2],
    ['Offset Leave', 0],
    ['Compensatory Time Off', 0],
  ];

  return (
    <div className="bg-white rounded-2xl shadow">
      <div
        style={bannerStyle}
        className="relative rounded-t-2xl p-4 flex items-center justify-between"
      >
        <img
          src={unionImg}
          alt=""
          className="absolute left-4 top-1/2 -translate-y-1/2 w-32 opacity-30 pointer-events-none select-none"
        />
        <h2 className="text-white font-semibold relative">Leave Credits</h2>
        <button className="bg-white text-indigo-700 text-sm font-semibold px-4 py-1 rounded">
          Apply
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="p-3 text-left">Leaves</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {credits.map(([label, count]) => (
            <tr key={label} className="border-b">
              <td className="p-3">{label}</td>
              <td className="p-3 text-right">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
