import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import { useUserProfile } from '../hooks/useFirebaseData.js';
import { updateUserProfile } from '../services/firebaseService.js';
import { mockUser } from '../data/mockUsers.js'; // Fallback

export default function ProfileSettingsPage({ user, setUser }) {
  const { profile: firebaseProfile, loading } = useUserProfile(user.id);
  const currentProfile = firebaseProfile || user || mockUser;
  const [profile, setProfile] = useState(currentProfile);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateUserProfile(user.id, profile);
      setUser(profile);
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Profile & settings" subtitle="Loading profile..." />
        <div className="grid gap-5 rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-farmsoil rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Profile & settings" subtitle="Manage your farm profile, bank and GST details, language preferences, and notifications." />
      <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2">
        {[
          { name: 'name', label: 'Name' },
          { name: 'businessName', label: 'Business name' },
          { name: 'mobile', label: 'Mobile' },
          { name: 'upiId', label: 'UPI ID' },
          { name: 'state', label: 'State' },
          { name: 'district', label: 'District' },
          { name: 'village', label: 'Village' },
          { name: 'pincode', label: 'Pincode' },
          { name: 'gstin', label: 'GSTIN' }
        ].map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{field.label}</span>
            <input
              name={field.name}
              value={profile[field.name] || ''}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-800 dark:border-slate-700"
            />
          </label>
        ))}
        <div className="col-span-full rounded-3xl bg-farmsoil p-4 text-sm text-farmgray dark:bg-slate-800">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Preferred language</p>
          <select name="preferredLanguage" value={profile.preferredLanguage} onChange={handleChange} className="mt-3 w-full rounded-3xl border border-farmsoil bg-white px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-900 dark:border-slate-700">
            {['English', 'Hindi', 'Kannada', 'Telugu', 'Tamil', 'Marathi'].map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="col-span-full rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-farmleaf">
          Save settings
        </button>
      </form>
    </div>
  );
}
