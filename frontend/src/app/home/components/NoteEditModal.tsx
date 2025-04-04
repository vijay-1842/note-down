"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction } from "react";
import { updateData } from "@/utils/axiosInstance";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(1, "Content cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;

type NoteEditData = {
  note_id: string;
  note_title: string;
  note_content: string;
};

const NoteEditModal: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getNotes: () => void;
  noteData: NoteEditData;
  setEditData: Dispatch<SetStateAction<NoteEditData | null>>;
}> = ({ open, setOpen, getNotes, noteData, setEditData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: noteData.note_title,
      content: noteData.note_content,
    },
  });

  const onSubmit = (data: FormData) => {
    updateData(`api/notes/${noteData.note_id}`, data).then(() => {
      getNotes();
      setEditData(null);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Enter the title and content for your note.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <Input
              {...register("title")}
              type="text"
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Content</label>
            <Textarea
              {...register("content")}
              placeholder="Enter note content..."
              rows={6}
            />
            {errors.content && (
              <p className="text-red-500">{errors.content.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Update Note
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditModal;
