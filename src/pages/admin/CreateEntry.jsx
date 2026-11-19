import { ArrowLeft, Upload } from "lucide-react";
import {
  FileUpload,
  FileUploadDropZone,
  FileListItemProgressBar,
  FileListItemProgressFill,
} from "@/components/fileUploader/application/file-upload/file-upload-base";
import { useState, useCallback } from "react";
import Textarea from "@/components/forms/Textarea";

export default function CreateEntry() {
  const [files, setFiles] = useState([]);

  const simulateUpload = useCallback((fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // 5-20% increments
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100, completed: true } : f)),
        );
      } else {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)));
      }
    }, 300); // Update every 300ms
    return () => clearInterval(interval);
  }, []);

  const handleDrop = (fileList) => {
    const newFiles = Array.from(fileList).map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      size: file.size,
      progress: 0,
      file: file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => simulateUpload(f.id));
  };

  const handleDelete = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <div className="w-full h-full p-5">
      <div className="w-full h-full grid grid-rows-[5vh_1fr] p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 py-3 px-4 bg-white rounded-lg text-black transition-colors hover:bg-prod-pink hover:text-white">
            <ArrowLeft size={22} />
            <span className="text-2xl uppercase">Back</span>
          </button>
          <button className="flex items-center gap-2 py-3 px-4 bg-prod-pink rounded-lg text-black transition-colors hover:bg-prod-pink/90 hover:text-white">
            <Upload size={20} />
            <span className="text-2xl uppercase">Upload</span>
          </button>
        </div>
        <div className="grid grid-cols-[60%_40%] pt-12">
          <div className="flex flex-col gap-4 px-6 pr-10">
            <div className="uppercase text-4xl text-prod-pink">Entry Details</div>
            <div className="grid grid-cols-6 gap-5">
              <div className="flex flex-col gap-1 col-span-3">
                <div>Name</div>
                <input
                  type="text"
                  placeholder="project name"
                  className="border-2 w-full border-white/40 rounded-lg h-[3.5vh] font-prodFont p-2 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-prod-pink focus:border-transparent transition-colors duration-100"
                />
              </div>
              <div className="flex flex-col gap-1 col-span-3">
                <div>Slug</div>
                <input
                  type="text"
                  placeholder="project-name"
                  className="border-2 w-full border-white/40 rounded-lg h-[3.5vh] font-prodFont p-2 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-prod-pink focus:border-transparent transition-colors duration-100"
                />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <div>Name</div>
                <input
                  type="text"
                  placeholder="Project name"
                  className="border-2 w-full border-white/40 rounded-lg h-[3.5vh] font-prodFont p-2 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-prod-pink focus:border-transparent transition-colors duration-100"
                />
              </div>
              <div className="flex flex-col gap-1 col-span-6">
                <Textarea
                  label="Brief Description"
                  placeholder="lorem ipsum?"
                  rows={2}
                  minRows={2}
                  maxRows={6}
                />
              </div>
              <div className="flex flex-col gap-1 col-span-6">
                <Textarea
                  label="Full Description"
                  placeholder="Project description..."
                  rows={3}
                  minRows={2}
                  maxRows={20}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col p-2 h-full">
            <div className="h-full rounded-lg flex flex-col overflow-hidden">
              <FileUpload.Root className="flex flex-col h-full">
                <div className="sticky top-0 z-10 bg-white/5">
                  <FileUpload.DropZone onDropFiles={handleDrop} accept="image/*" />
                </div>
                <div className="flex-1 overflow-y-auto pr-1">
                  <FileUpload.List>
                    {files.map((f) => (
                      <FileUpload.ListItemProgressBar
                        key={f.id}
                        name={f.name}
                        size={f.size}
                        progress={f.progress}
                        failed={f.failed}
                        onDelete={() => handleDelete(f.id)}
                        onRetry={() => simulateUpload(f.id)}
                      />
                    ))}
                  </FileUpload.List>
                </div>
              </FileUpload.Root>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
