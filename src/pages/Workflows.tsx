import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  lastRun: string;
}

const initialWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Daily Report Generation',
    description: 'Automates the generation and distribution of daily sales reports.',
    status: 'active',
    lastRun: '2023-10-26 08:00 AM',
  },
  {
    id: '2',
    name: 'Customer Onboarding Sequence',
    description: 'Manages the automated email sequence for new customer onboarding.',
    status: 'active',
    lastRun: '2023-10-25 03:30 PM',
  },
  {
    id: '3',
    name: 'Inventory Restock Alert',
    description: 'Sends alerts when inventory levels fall below a predefined threshold.',
    status: 'inactive',
    lastRun: '2023-10-24 11:00 AM',
  },
  {
    id: '4',
    name: 'Social Media Post Scheduler',
    description: 'Schedules and publishes content across various social media platforms.',
    status: 'active',
    lastRun: '2023-10-26 10:15 AM',
  },
];

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.map((workflow) =>
        workflow.id === id
          ? { ...workflow, status: workflow.status === 'active' ? 'inactive' : 'active' }
          : workflow
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Workflows</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Workflow
          </Button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search workflows..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-6">
          {filteredWorkflows.map((workflow) => (
            <Card 
              key={workflow.id} 
              className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 ease-in-out 
                         dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500
                         before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500 before:via-purple-500 before:to-pink-500 
                         before:opacity-0 group-hover:before:opacity-20 before:blur-xl before:transition-all before:duration-500 before:ease-in-out"
            >
              <div className="relative z-10 bg-white dark:bg-gray-800 p-6 rounded-lg h-full">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{workflow.name}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: <span className={`font-semibold ${workflow.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Run: {workflow.lastRun}</p>
                </CardContent>
                <CardFooter className="p-0 flex justify-end space-x-2">
                  <Button variant="outline" className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">Edit</Button>
                  <Button 
                    variant={workflow.status === 'active' ? 'destructive' : 'default'} 
                    onClick={() => handleToggleStatus(workflow.id)}
                  >
                    {workflow.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflows;