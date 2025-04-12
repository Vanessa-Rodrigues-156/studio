import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import TaskColumn from '@/components/TaskColumn';
import TaskBlock from '@/components/TaskBlock';
import {Button} from '@/components/ui/button';
import {PlusIcon} from 'lucide-react';
import {useState} from 'react';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from '@/components/ui/alert-dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

interface Task {
  id: string;
  headline: string;
  description: string;
  prerequisites: string;
  deadline: string;
  files: string[];
  urls: string[];
  reminders: string[];
  collaborators: string[];
}

const initialTasks: Task[] = [
  {
    id: '1',
    headline: 'Setup Next.js project',
    description: 'Initialize project with necessary configurations',
    prerequisites: 'Node.js, npm/yarn',
    deadline: '2024-08-10',
    files: [],
    urls: [],
    reminders: [],
    collaborators: [],
  },
  {
    id: '2',
    headline: 'Implement drag and drop',
    description: 'Configure react-beautiful-dnd for task movement',
    prerequisites: 'Basic React knowledge',
    deadline: '2024-08-12',
    files: [],
    urls: [],
    reminders: [],
    collaborators: [],
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    headline: '',
    description: '',
    prerequisites: '',
    deadline: '',
    files: [],
    urls: [],
    reminders: [],
    collaborators: [],
  });
  const [open, setOpen] = useState(false);

  const [columns, setColumns] = useState({
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: tasks.filter((task) => task.id === '1' || task.id === '2').map((task) => task.id),
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Completed',
      taskIds: [],
    },
  });

  const onDragEnd = (result: DropResult) => {
    const {destination, source, draggableId} = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTask({...newTask, [e.target.name]: e.target.value});
  };

  const handleCreateTask = () => {
    if (newTask.headline && newTask.description) {
      const newId = String(tasks.length + 1);
      const taskWithId = {...newTask, id: newId};
      setTasks([...tasks, taskWithId]);
      setColumns({
        ...columns,
        'column-1': {
          ...columns['column-1'],
          taskIds: [...columns['column-1'].taskIds, newId],
        },
      });
      setNewTask({
        headline: '',
        description: '',
        prerequisites: '',
        deadline: '',
        files: [],
        urls: [],
        reminders: [],
        collaborators: [],
      });
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background antialiased overflow-x-auto">
      <header className="sticky top-0 z-10 bg-secondary border-b p-4 shadow-sm">
        <h1 className="text-2xl font-bold">TaskFlow Kanban Board</h1>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-grow space-x-4 p-4 overflow-x-auto">
          {Object.values(columns).map((column) => (
            <TaskColumn key={column.id} column={column}>
              {column.taskIds.map((taskId, index) => {
                const task = tasks.find((task) => task.id === taskId);
                if (!task) return null;
                return <TaskBlock key={task.id} task={task} index={index}/>;
              })}
            </TaskColumn>
          ))}
        </div>
      </DragDropContext>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button className="m-4" onClick={() => setOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4"/>
            Create New Task
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Task</AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the details for your new task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="headline" className="text-right">
                Headline
              </Label>
              <Input type="text" id="headline" name="headline" value={newTask.headline}
                     onChange={handleInputChange} className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input type="text" id="description" name="description" value={newTask.description}
                     onChange={handleInputChange} className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prerequisites" className="text-right">
                Prerequisites
              </Label>
              <Input type="text" id="prerequisites" name="prerequisites" value={newTask.prerequisites}
                     onChange={handleInputChange} className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input type="date" id="deadline" name="deadline" value={newTask.deadline}
                     onChange={handleInputChange} className="col-span-3"/>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateTask}>Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
