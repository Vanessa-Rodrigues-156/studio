"use client";

import {Draggable} from 'react-beautiful-dnd';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card';

interface TaskBlockProps {
  task: {
    id: string;
    headline: string;
    description: string;
    prerequisites: string;
    deadline: string;
    files: string[];
    urls: string[];
    reminders: string[];
    collaborators: string[];
  };
  index: number;
}

const TaskBlock: React.FC<TaskBlockProps> = ({task, index}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>{task.headline}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{task.description}</CardDescription>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskBlock;
