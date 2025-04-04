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
import { postData } from "@/utils/axiosInstance";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(1, "Content cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;

export default function NoteModal({
  open,
  setOpen,
  getNotes,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getNotes: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = (data: FormData) => {
    postData("api/notes", data).then(() => {
      setOpen(false);
      getNotes();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
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
            Save Note
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
