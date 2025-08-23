"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Simulate fetching workflows from an API
    const fetchWorkflows = async () => {
      // In a real application, you would fetch this from your backend
      const dummyWorkflows: Workflow[] = [
        {
          id: '1',
          name: 'Customer Support Triage',
          description: 'Automatically categorize and route incoming customer support tickets.',
          icon: '💬',
        },
        {
          id: '2',
          name: 'Lead Qualification',
          description: 'Qualify sales leads based on predefined criteria and assign to sales reps.',
          icon: '📈',
        },
        {
          id: '3',
          name: 'Social Media Monitoring',
          description: 'Monitor social media for brand mentions and sentiment analysis.',
          icon: '📱',
        },
        {
          id: '4',
          name: 'Content Generation',
          description: 'Generate blog post ideas and draft initial content based on keywords.',
          icon: '✍️',
        },
        {
          id: '5',
          name: 'Data Entry Automation',
          description: 'Automate data extraction from documents and input into spreadsheets.',
          icon: '📊',
        },
        {
          id: '6',
          name: 'Email Campaign Management',
          description: 'Manage and automate personalized email marketing campaigns.',
          icon: '📧',
        },
        {
          id: '7',
          name: 'Inventory Management',
          description: 'Track inventory levels, reorder products, and manage stock alerts.',
          icon: '📦',
        },
        {
          id: '8',
          name: 'Employee Onboarding',
          description: 'Automate the onboarding process for new employees, including task assignment.',
          icon: '🧑‍💻',
        },
      ];
      setWorkflows(dummyWorkflows);
    };

    fetchWorkflows();
  }, []);

  const filteredWorkflows = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        workflow.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [workflows, searchTerm]);

  const handleSelectWorkflow = (workflowId: string) => {
    console.log(`Selected workflow: ${workflowId}`);
    // In a real app, you might navigate to a detail page or open a modal
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="w-full max-w-4xl mb-8 text-center">
        <img src="/logo.svg" alt="Logo" className="mx-auto h-16 w-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Workflows
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Select a workflow to get started.
        </p>
      </div>

      <div className="relative w-full max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search workflows..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredWorkflows.map((workflow) => (
          <Card
            key={workflow.id}
            className="m-2 bg-white/50 dark:bg-black/30 border border-white/30 text-foreground shadow-lg flex flex-col cursor-pointer transition-all duration-300 ease-in-out hover:shadow-purple-glow"
            onClick={() => handleSelectWorkflow(workflow.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                {workflow.name}
              </CardTitle>
              <span className="text-2xl">{workflow.icon}</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {workflow.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Workflows;