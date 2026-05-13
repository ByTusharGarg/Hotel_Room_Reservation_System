"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [numRooms, setNumRooms] = useState("1");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [justBooked, setJustBooked] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data.rooms);
    } catch (e) {
      console.error(e);
      setMessage("Failed to load rooms");
    }
    setLoading(false);
  };

  const handleBook = async () => {
    const k = parseInt(numRooms, 10);
    if (isNaN(k) || k < 1 || k > 5) {
      setMessage("Error: You can only book between 1 and 5 rooms at a time.");
      return;
    }
    setMessage("");
    setJustBooked([]);
    setLoading(true);
    try {
      const res = await fetch("/api/rooms/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ k }),
      });
      const data = await res.json();
      if (res.ok) {
        setJustBooked(data.booked);
        setMessage(`Successfully booked ${data.booked.length} rooms!`);
        await fetchRooms();
      } else {
        setMessage(data.error || "Booking failed");
        setLoading(false);
      }
    } catch (e) {
      setMessage("Booking request failed");
      setLoading(false);
    }
  };

  const handleRandomize = async () => {
    setMessage("");
    setJustBooked([]);
    setLoading(true);
    await fetch("/api/rooms/random", { method: "POST" });
    await fetchRooms();
  };

  const handleReset = async () => {
    setMessage("");
    setJustBooked([]);
    setLoading(true);
    await fetch("/api/rooms/reset", { method: "POST" });
    await fetchRooms();
  };

  // Group rooms by floor
  const floors = [];
  for (let f = 10; f >= 1; f--) {
    floors.push({
      floor: f,
      rooms: rooms.filter((r) => r.floor === f).sort((a, b) => a.roomIndex - b.roomIndex),
    });
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 font-sans relative">
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress {
          animation: progress 1.5s infinite linear;
        }
      `}</style>

      {loading && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-800 z-50 overflow-hidden shadow-[0_0_10px_rgba(59,130,246,0.5)]">
          <div className="w-1/2 h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-progress"></div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Hotel Room Reservation System</h1>
          <p className="text-gray-400">Optimize travel time across 10 floors and 97 rooms.</p>
        </header>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-700 flex flex-wrap gap-4 items-end justify-center">
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Number of Rooms (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={numRooms}
              onChange={(e) => setNumRooms(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded px-4 py-2 w-32 text-center text-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <button onClick={handleBook} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors disabled:opacity-50 h-[46px]">
            Book Rooms
          </button>
          <div className="w-px h-10 bg-gray-600 mx-4 hidden md:block"></div>
          <button onClick={handleRandomize} disabled={loading} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-semibold transition-colors disabled:opacity-50 h-[46px]">
            Random Occupancy
          </button>
          <button onClick={handleReset} disabled={loading} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold transition-colors disabled:opacity-50 h-[46px]">
            Reset All
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded text-center font-semibold ${message.includes("Success") ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-4 justify-center text-sm font-medium">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-sm"></div> Available</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-600 rounded-sm"></div> Occupied</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded-sm shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div> Just Booked</div>
        </div>

        <div className="relative border-4 border-gray-700 rounded-2xl bg-gray-800 p-8 shadow-2xl overflow-x-auto">
          {loading && rooms.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Loading hotel structure...</div>
          ) : (
            <div className="flex flex-col gap-2 min-w-max">
              {floors.map((floor) => (
                <div key={floor.floor} className="flex items-center gap-4">
                  {/* Stairs / Lift Indicator */}
                  <div className="w-20 flex-shrink-0 bg-gray-700 border border-gray-600 rounded h-12 flex items-center justify-center text-sm font-bold text-gray-300 text-center">
                    Floor {floor.floor} <br /> Lift
                  </div>
                  
                  {/* Rooms */}
                  <div className="flex gap-2 flex-grow">
                    {floor.rooms.map((room) => {
                      const isBookedNow = justBooked.includes(room.id);
                      let bgColor = "bg-green-500 hover:bg-green-400";
                      let textColor = "text-green-900";
                      
                      if (room.status === "occupied") {
                        bgColor = "bg-gray-600";
                        textColor = "text-gray-300";
                      }
                      if (isBookedNow) {
                        bgColor = "bg-yellow-400 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.6)]";
                        textColor = "text-yellow-900";
                      }

                      return (
                        <div
                          key={room.id}
                          className={`w-14 h-12 flex items-center justify-center rounded font-bold text-sm transition-all duration-300 cursor-default border border-black/20 ${bgColor} ${textColor}`}
                          title={`Room ${room.id} - ${room.status}`}
                        >
                          {room.id}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
