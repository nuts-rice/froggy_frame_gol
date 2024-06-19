import Link from 'next/link';
import { Board } from '@/app/components/Game';
import redis from '@/app/lib/redis';
const SEVEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 7;

async function getBoards() {
  try {
    const boardIds = await redis.zrange(
      'boards_by_date',
      Date.now(),
      Date.now() - SEVEN_DAYS_IN_MS,
      {
        byScore: true,
        rev: true,
        count: 100,
        offset: 0,
      },
    );
    console.log(boardIds);
    if (!boardIds.length) {
      return [];
    }
    let multi = redis.multi();
    boardIds.forEach((id) => {
      multi.hgetall(`board:${id}`);
    });
    let items: Board[] = await multi.exec();
    return items.map((item) => {
      return { ...item };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page() {
  const boards = await getBoards();
  console.log(boards);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-lg sm:text-2xl font-bold mb-2">Created Boards</h1>
        <div className="flex-1 flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
          {boards.map((board) => {
            return (
              <div key={board.boardId}>
                <a href={`components/Boards/${board.boardId}`} className="underline">
                  <p className="text-md sm:text-xl mx-4">{board.lastEvolvedUser}</p>
                </a>
              </div>
            );
          })}
        </div>
        <Link href="/">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Board
          </button>
        </Link>
      </main>
    </div>
  );
}
