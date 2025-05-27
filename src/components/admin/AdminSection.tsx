import React from 'react';
import { AdminDashboard } from './AdminDashboard'; // Assuming AdminDashboard is already refactored
import { ShieldCheck } from 'lucide-react'; // Icon for Admin section

interface AdminSectionProps {
  onError: (error: string) => void;
  onCloseAdmin: () => void; // Function to close the admin section (likely passed to AdminDashboard)
}

export function AdminSection({ onError, onCloseAdmin }: AdminSectionProps) {
  return (
    // Use theme's background for the entire section page
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8"> 
      <div className="max-w-6xl mx-auto">
        {/* Optional: Add a header card for the Admin Section title if desired */}
        {/* <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body items-center text-center">
            <ShieldCheck size={32} className="text-primary mb-2"/>
            <h1 className="card-title text-3xl font-bold text-base-content">Admin Dashboard</h1>
          </div>
        </div> */}
        
        {/* AdminDashboard component will contain its own card and layout */}
        <AdminDashboard onError={onError} onClose={onCloseAdmin} />
      </div>
    </div>
  );
}