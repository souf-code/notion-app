import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'; // ✅ make sure this is here
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();

  // ✅ Add this block directly after router
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      }
    };
    checkUser();
  }, []);

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [search, setSearch] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    else setProjects(data);
  }

  async function handleAddProject(e) {
    e.preventDefault();
    const { data, error } = await supabase.from('projects').insert([
      {
        name,
        instructions,
        image_url: imageUrl,
        worker_name: workerName,
      },
    ]);
    if (error) console.error(error);
    else {
      setName('');
      setInstructions('');
      setImageUrl('');
      setWorkerName('');
      fetchProjects();
    }
  }

  async function handleDelete(id) {
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  }

  function handlePaste(e) {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        uploadImage(file);
        break;
      }
    }
  }

  async function uploadImage(file) {
  if (!file || !file.name) return;
  const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage.from('project-images').upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
    } else {
      console.error(error);
    }
  }

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto" onPaste={handlePaste}>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <form onSubmit={handleAddProject} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Worker name"
          value={workerName}
          onChange={(e) => setWorkerName(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => uploadImage(e.target.files[0])}
          className="border p-2 w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Project</button>
      </form>

      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <div className="space-y-6 max-h-[60vh] overflow-y-auto">
        {filteredProjects.map((project) => (
          <div key={project.id} className="border p-4 rounded shadow relative">
            <button
              onClick={() => handleDelete(project.id)}
              className="absolute top-2 right-2 text-red-500 hover:underline"
            >
              Delete
            </button>
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <p className="text-sm text-gray-700 mb-2">{project.instructions}</p>
            {project.image_url && (
              <img
                src={project.image_url}
                alt="project"
                className="w-48 h-auto mt-2 rounded cursor-zoom-in hover:scale-110 transition-transform"
                onClick={() => window.open(project.image_url, '_blank')}
              />
            )}
            <p className="text-xs text-gray-500 mt-2">
              Added by: {project.worker_name || 'Unknown'} — {new Date(project.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
