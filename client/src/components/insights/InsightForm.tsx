import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AIRouteRequest } from '@shared/schema';

// Schema for the insight form
const insightFormSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters long',
  }),
  model: z.string().optional(),
  maxDistance: z.coerce.number().min(0).optional(),
  maxDuration: z.coerce.number().min(0).optional(),
  includeNoFlyZones: z.boolean().default(false),
});

interface InsightFormProps {
  onSubmit: (data: AIRouteRequest) => void;
  isSubmitting?: boolean;
}

export default function InsightForm({ onSubmit, isSubmitting = false }: InsightFormProps) {
  // Initialize form with default values
  const form = useForm<z.infer<typeof insightFormSchema>>({
    resolver: zodResolver(insightFormSchema),
    defaultValues: {
      prompt: '',
      model: 'gpt-4o',
      maxDistance: undefined,
      maxDuration: undefined,
      includeNoFlyZones: false,
    },
  });

  // Form submission handler
  function handleSubmit(values: z.infer<typeof insightFormSchema>) {
    // Transform the form values to match the AIRouteRequest interface
    const request: AIRouteRequest = {
      prompt: values.prompt,
      maxDistance: values.maxDistance,
      maxDuration: values.maxDuration,
      includeNoFlyZones: values.includeNoFlyZones,
    };
    
    onSubmit(request);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400 text-sm font-medium">Task Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., I need to plan a drone route to survey flood damage along the riverside area, covering 2 square km, prioritizing residential zones, and avoiding restricted airspace." 
                  className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400 text-sm font-medium">AI Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-900 border border-gray-700 text-white">
                  <SelectItem value="gpt-4o">GPT-4o (Most Capable)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</SelectItem>
                  <SelectItem value="deepseek">DeepSeek Core</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel className="text-gray-400 text-sm font-medium">Optional Parameters</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400 text-xs mb-1">Max Distance (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="5"
                      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400 text-xs mb-1">Max Duration (min)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="45"
                      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormItem>
        
        <FormField
          control={form.control}
          name="includeNoFlyZones"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-gray-300 text-sm">Include no-fly zones in analysis</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full px-4 py-3 bg-primary hover:bg-primary/80 text-white rounded-md font-medium"
          disabled={isSubmitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          {isSubmitting ? 'Generating...' : 'Generate Insights'}
        </Button>
      </form>
    </Form>
  );
}
