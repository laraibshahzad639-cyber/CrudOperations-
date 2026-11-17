import { role } from "@prisma/orm-postgres/contract-builder";
import { db } from "../prisma/db.ts";
import { Temporal } from "@js-temporal/polyfill";


export const createTask = async (data) => {
  return db.orm.public.Task.create(data);
};

export const getTaskById = async (id, userId,role) => {
const filter=role==="ADMIN"?{id}:{id,userId};

  const task = await db.orm.public.Task.where( filter ).first();


  return task;
};

export const deleteTask = async (id, userId, role) => {
  const filter = role === "ADMIN"
    ? { id }
    : { id, userId };

  const task = await db.orm.public.Task
    .where(filter)
    .first();

  if (!task) {
    return null;
  }

  await db.orm.public.Task
    .where(filter)
    .delete();

  return task;
};

export const updateTask = async (id, userId, data, role) => {
 
const filter=role==="ADMIN"?{id}:{id,userId};
 return  await db.orm.public.Task.where(filter).update(data);
//   if (role === "ADMIN") {
//     await db.orm.public.Task.where({ id }).update(data);
//   } else {
//     await db.orm.public.Task.where({ id, userId }).update(data);
//   }

//   return await getTaskById(id, userId);
// };
}


export const getAllTask = async (
  role,
  userId,
  completed,

  priority,
  status,
  page1 = 1,
  limit1 = 10,
  order
) => {
  const skip = (page1 - 1) * limit1;

  let task = db.orm.public.Task.include("comments", (comments) =>
    comments.select("content")
  );

  if (role !== "ADMIN") {
    task = task.where({ userId: userId });
  }

  if (completed !== undefined) {
    task = task.where({ completed: completed });
  }

  if (priority !== undefined) {
    task = task.where({ priority: priority });
  }
  if (status !== undefined) {
    // console.log("Test status")
    task = task.where({ status: status });
    // console.log("test status")
  }

  if (order !== undefined) {
    console.log("Test service");
    task = task.orderBy((t) =>
      order === "desc" ? t.priority.desc() : t.priority.asc()
    );

    // console.log("Test service");
  }

  return await task
    .limit(limit1)
    .offset(skip)
    .include("user", (user) => user.select("name", "role", "email"))
    .all();
};

export const checkStatusSummary = async (role, userId) => {
  // console.log("test service ");

  const summary = {
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
  };

  // console.log("test object");

  let tasks;

  if (role === "ADMIN") {
    tasks = await db.orm.public.Task.all();
  } else {
    tasks = await db.orm.public.Task.where({ userId: userId }).all();
  }

  // console.log("test query ");

  for (let task of tasks) {
    if (task.status == "TODO") {
      summary.TODO++;
    } else if (task.status == "IN_PROGRESS") {
      summary.IN_PROGRESS++;
    } else if (task.status == "COMPLETED") {
      summary.COMPLETED++;
    }
  }

  return summary;
};
export const getOverdueTask = async (role, userId) => {

  let task = db.orm.public.Task;

  if (role !== "ADMIN") {
    task = task.where({ userId: userId });
  }

  const currentDate = Temporal.Now.instant();

  const allTasks = await task.all();

  const overdueTasks = [];

  for (const item of allTasks) {

    if (
      item.dueDate &&
      Temporal.Instant.compare(
        Temporal.Instant.from(item.dueDate.toString()),
        currentDate
      ) < 0 &&
      item.status !== "COMPLETED" &&
      item.completed !== true
    ) {
      overdueTasks.push(item);
    }
  }

  return overdueTasks;
};
export const upcommingTasks = async (userId, role, days = 7) => {
  const startDate = new Date();

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);

  let tasks;

  if (role !== "ADMIN") {
    tasks = await db.orm.public.Task
      .where({ userId: userId })
      .all();
  } else {
    tasks = await db.orm.public.Task.all();
  }

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    const dueDate = new Date(task.dueDate.toString());

    return (
      dueDate >= startDate &&
      dueDate <= endDate &&
      task.status !== "COMPLETED"&&
           task.completed !== true
    );
  });

  upcomingTasks.sort((a, b) => {
    return (
      new Date(a.dueDate.toString()) -
      new Date(b.dueDate.toString())
    );
  });

  return upcomingTasks;
};
// export const extendDueDate=async(id,userId,role,days)=>{
  
//   let task;
//   if(role!=="ADMIN"){
//     task=await db.orm.public.Task.where({userId:userId,id}).all();
//   }
 
  
//   if(task.status==="COMPLETED"||task.completed===true){
//     return errorMessage(res,400,"Cannot extend due date for completed task");

//   }
//   const updateDate=new Date(task.dueDate.toString());
//   updateDate.setDate(updateDate.getDate()+days);
//   const taskDate={
//     dueDate:updateDate
//   }

//   const updatedTask=await db.orm.public.Task.where({id}).update({dueDate:updateDate});
//   return updatedTask;

// }



export const extendDueDate = async (id, userId, role, days) => {

  let task;

  if (role !== "ADMIN") {
    task = await db.orm.public.Task
      .where({ userId: userId, id })
      .first();
  } else {
    task = await db.orm.public.Task
      .where({ id })
      .first();
  }

  if (!task) {
    return null;
  }

  if (task.status === "COMPLETED" || task.completed === true) {
    return { error: "Cannot extend due date for completed task" };
  }

  if (!task.dueDate) {
    return { error: "Task does not have a due date" };
  }

  if (!Number.isInteger(Number(days)) || Number(days) <= 0) {
    return { error: "Days must be a positive number" };
  }

  const currentDate = Temporal.Now.instant();

  const oldDueDate = Temporal.Instant.from(task.dueDate.toString());

 
  let baseDate = oldDueDate;

  if (Temporal.Instant.compare(oldDueDate, currentDate) < 0) {
    baseDate = currentDate;
  }

  const updateDate = baseDate.add({
    hours: Number(days) * 24
  });


  const updatedTask = await db.orm.public.Task
    .where({ id })
    .update({ dueDate: updateDate });

  return updatedTask;
};
