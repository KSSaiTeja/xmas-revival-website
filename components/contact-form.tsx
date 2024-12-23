/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name (at least 2 characters)"),
  email: z
    .string()
    .email("Please enter a valid email address (e.g., name@example.com)"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number (at least 10 digits)")
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number format"),
});

export function ContactForm({ onSubmit }: { onSubmit: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const storedData = localStorage.getItem("christmasFormData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      form.reset(parsedData);
      onSubmit(); // Immediately call onSubmit if data exists
    }
  }, [form, onSubmit]);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      localStorage.setItem("christmasFormData", JSON.stringify(values));
      localStorage.setItem("christmasEntryId", data.entryId.toString());
      setIsLoading(false);
      onSubmit();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred",
      );
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="glass-form space-y-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  {...field}
                  className={`bg-white/10 text-white placeholder:text-white/70 border-white/20 h-11 rounded-xl text-base ${
                    form.formState.errors[field.name]
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm ml-1 font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  {...field}
                  className={`bg-white/10 text-white placeholder:text-white/70 border-white/20 h-11 rounded-xl text-base ${
                    form.formState.errors[field.name]
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm ml-1 font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email Address"
                  type="email"
                  {...field}
                  className={`bg-white/10 text-white placeholder:text-white/70 border-white/20 h-11 rounded-xl text-base ${
                    form.formState.errors[field.name]
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm ml-1 font-medium" />
            </FormItem>
          )}
        />
        {errorMessage && (
          <div className="text-red-500 text-sm font-medium text-center">
            {errorMessage}
          </div>
        )}
        <Button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-lobster text-lg h-11 rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting...
            </>
          ) : (
            "Get My Surprise Gift! 🎁"
          )}
        </Button>
      </form>
    </Form>
  );
}
