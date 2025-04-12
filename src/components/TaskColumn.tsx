"use client";

import {Droppable} from 'react-beautiful-dnd';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';

interface TaskColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
  children: React.ReactNode;
}

const TaskColumn: React.FC<TaskColumnProps> = ({column, children}) => {
  return (
    <Card className="w-72 flex-shrink-0">
      <CardHeader>
        <CardTitle>{column.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-h-[200px] bg-secondary rounded-md p-2 shadow-inner"
            >
              {children}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};

export default TaskColumn;
