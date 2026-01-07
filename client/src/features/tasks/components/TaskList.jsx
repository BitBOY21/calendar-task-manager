import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDelete, onUpdate, onGenerateAI, onDragEnd }) => {
    
    // Default drag handler if none provided
    const handleDragEnd = (result) => {
        if (onDragEnd) onDragEnd(result);
    };

    return (
        <div style={styles.listContainer}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks-list">
                    {(provided) => (
                        <ul 
                            style={styles.list}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {tasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                marginBottom: '10px',
                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                            }}
                                        >
                                            <TaskItem
                                                task={task}
                                                onDelete={onDelete}
                                                onUpdate={onUpdate}
                                                onGenerateAI={onGenerateAI}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

const styles = {
    listContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: '0',
        height: '100%',
        overflowY: 'auto'
    },
    list: { 
        listStyleType: 'none', 
        padding: 0, 
        margin: 0 
    },
};

export default TaskList;