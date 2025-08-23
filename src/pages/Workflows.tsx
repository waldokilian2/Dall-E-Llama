"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, Workflow as WorkflowIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  lastRun: string;
  tags: string[];
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Daily Report Generation',
    description: 'Automates the generation and distribution of daily sales reports.',
    status: 'active',
    lastRun: '2023-10-26 08:00 AM',
    tags: ['reporting', 'sales', 'automation'],
  },
  {
    id: '2',
    name: 'Customer Onboarding Sequence',
    description: 'Manages the automated email sequence for new customer onboarding.',
    status: 'inactive',
    lastRun: '2023-10-20 03:00 PM',
    tags: ['marketing', 'onboarding', 'email'],
  },
  {
    id: '3',
    name: 'Inventory Restock Alert',
    description: 'Sends alerts when inventory levels drop below a predefined threshold.',
    status: 'active',
    lastRun: '2023-10-26 10:30 AM',
    tags: ['inventory', 'alerts', 'supply chain'],
  },
  {
    id: '4',
    name: 'Social Media Post Scheduler',
    description: 'Schedules and publishes posts across various social media platforms.',
    status: 'draft',
    lastRun: 'Never',
    tags: ['marketing', 'social media', 'scheduling'],
  },
  {
    id: '5',
    name: 'Invoice Processing',
    description: 'Automates the processing and sending of customer invoices.',
    status: 'active',
    lastRun: '2023-10-25 02:00 PM',
    tags: ['finance', 'invoicing', 'automation'],
  },
];

const Workflows: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkflows = mockWorkflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <WorkflowIcon className="mr-3 h-8 w-8 text-blue-600" />
          Workflows
        </h1>
        <Link to="/workflows/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Workflow
          </Button>
        </Link>
      </div>

      <div className="mb-8 relative">
        <Input
          type="text"
          placeholder="Search workflows by name, description, or tag..."
          className="pl-10 pr-4 py-2 border rounded-md w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {filteredWorkflows.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No workflows found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {filteredWorkflows.map((workflow) => (
            <Card 
              key={workflow.id} 
              className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
              
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{workflow.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {workflow.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">{tag}</Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status: <Badge variant={workflow.status === 'active' ? 'default' : workflow.status === 'inactive' ? 'destructive' : 'outline'} className={workflow.status === 'active' ? 'bg-green-500 hover:bg-green-600 text-white' : workflow.status === 'inactive' ? 'bg-red-500 hover:bg-red-600 text-white' : 'dark:border-gray-600 dark:text-gray-300'}>{workflow.status}</Badge>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last Run: {workflow.lastRun}</p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link to={`/workflows/${workflow.id}`}>
                  <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workflows;