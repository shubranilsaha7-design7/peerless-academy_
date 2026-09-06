import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Trash2, Link } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function DynamicMediaManager() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const bucket = activeTab === 'image' ? 'images' : 'videos';
      const ext = file.name.split('.').pop();
      const filename = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage.from(bucket).upload(filename, file);
      if (error) throw error;
      
      alert('Upload successful!');
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button onClick={() => setActiveTab('image')} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${activeTab === 'image' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          <ImageIcon size={18} /> Image Gallery
        </button>
        <button onClick={() => setActiveTab('video')} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${activeTab === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          <Video size={18} /> Video Vault
        </button>
      </div>

      <div className="border-2 border-dashed border-slate-700 rounded-3xl p-12 text-center hover:bg-slate-800/50 transition">
        <UploadCloud size={48} className="mx-auto text-slate-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Upload {activeTab === 'image' ? 'Images' : 'Videos'}</h3>
        <p className="text-slate-400 text-sm mb-6">Drag and drop or browse from your device. Syncs directly to secure cloud buckets.</p>
        
        <label className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black cursor-pointer hover:bg-slate-200 transition">
          {uploading ? 'Uploading...' : 'Select File'}
          <input type="file" className="hidden" accept={activeTab === 'image' ? "image/*" : "video/*"} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}
