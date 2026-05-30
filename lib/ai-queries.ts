"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { transformText, type TransformAction } from "@/server/ai";

export function useTransformText() {
  return useMutation({
    mutationFn: async (input: {
      text: string;
      action: TransformAction;
      instruction?: string;
    }) => {
      const result = await transformText(input);
      if (!result.success || !result.data) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
