"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  lastModified: string;
}

const mockWorkflows: Workflow[] = [
  { id: '1', name: 'Customer Onboarding', description: 'Automate the process of onboarding new customers.', lastModified: '2023-10-26' },
  { id: '2', name: 'Invoice Processing', description: 'Streamline invoice approval and payment.', lastModified: '2023-10-25' },
  { id: '3', name: 'Employee Leave Request', description: 'Manage employee leave requests and approvals.', lastModified: '2023-10-24' },
  { id: '4', name: 'Bug Report Triage', description: 'Automate the initial triage of incoming bug reports.', lastModified: '2023-10-23' },
  { id: '5', name: 'Marketing Campaign Launch', description: 'Coordinate tasks for launching new marketing campaigns.', lastModified: '2023-10-22' },
];

const Workflows: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkflows = mockWorkflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-200">My Workflows</h1>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105">
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Workflow
        </Button>
      </div>

      <div className="relative mb-8">
        <Input
          type="text"
          placeholder="Search workflows..."
          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Link to={`/workflows/${workflow.id}`} key={workflow.id} className="block">
            <Card className="bg-white/50 dark:bg-black/30 border border-white/30 text-foreground shadow-lg flex flex-col h-full
                           transition-all duration-300 ease-in-out
                           hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/50 hover:border-purple-400
                           cursor-pointer">
              <CardHeader>
                <CardTitle className="text-purple-700 dark:text-purple-300">{workflow.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{workflow.description}</p>
              </CardContent>
              <CardFooter className="text-xs text-gray-500 dark:text-gray-400">
                Last Modified: {workflow.lastModified}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Workflows;