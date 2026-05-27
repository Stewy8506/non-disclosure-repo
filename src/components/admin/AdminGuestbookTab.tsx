import React from "react";
import { Trash2 } from "lucide-react";

interface AdminGuestbookTabProps {
  filteredGuestbook: any[];
  handleDeleteGuestbookEntry: (id: string) => void;
}

export default function AdminGuestbookTab({
  filteredGuestbook,
  handleDeleteGuestbookEntry
}: AdminGuestbookTabProps) {
  return (
    <table className="w-full text-left text-sm whitespace-nowrap">
      <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
        <tr>
          <th className="px-6 py-4 font-medium">Name</th>
          <th className="px-6 py-4 font-medium">Message</th>
          <th className="px-6 py-4 font-medium">Date</th>
          <th className="px-6 py-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800/50">
        {filteredGuestbook.map((entry: any) => (
          <tr key={entry.id} className="hover:bg-zinc-800/20 transition-colors">
            <td className="px-6 py-3 font-medium text-zinc-100">{entry.name}</td>
            <td className="px-6 py-3 text-zinc-300 max-w-xs truncate" title={entry.message}>{entry.message}</td>
            <td className="px-6 py-3 text-zinc-400">
              {entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleString() : "Unknown"}
            </td>
            <td className="px-6 py-3 text-right">
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleDeleteGuestbookEntry(entry.id)}
                  className="p-1.5 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {filteredGuestbook.length === 0 && (
          <tr>
            <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
              No guestbook entries found matching your criteria.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
