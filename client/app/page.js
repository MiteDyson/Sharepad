import CollaborativeEditor from '@/components/CollaborativeEditor';

export default function Home() {
  return (
    <main className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4'>
      <header className='mb-6 text-center'>
        <h1 className='text-3xl font-bold text-indigo-600'>SharePad</h1>
        <p className='text-gray-500 text-sm'>Real-time collaborative workspace</p>
      </header>
      
      <div className='w-full max-w-7xl h-[80vh] bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200'>
        <CollaborativeEditor />
      </div>
    </main>
  );
}
