import { NextResponse } from 'next/server';
import { initDb } from '@/lib/initDb';
import Room from '@/models/Room';

// Utility for travel time algorithm
function getDist(roomA, roomB) {
  if (roomA.floor === roomB.floor) {
    return Math.abs(roomA.roomIndex - roomB.roomIndex);
  } else {
    return roomA.roomIndex + Math.abs(roomA.floor - roomB.floor) * 2 + roomB.roomIndex;
  }
}

function getCombinations(arr, k) {
  const results = [];
  const n = arr.length;
  if (k === 0) return [[]];
  if (n < k) return [];
  
  const indices = Array.from({ length: k }, (_, i) => i);
  
  while (true) {
    results.push(indices.map(i => arr[i]));
    let i = k - 1;
    while (i >= 0 && indices[i] === i + n - k) {
      i--;
    }
    if (i < 0) break;
    indices[i]++;
    for (let j = i + 1; j < k; j++) {
      indices[j] = indices[j - 1] + 1;
    }
  }
  return results;
}

export async function POST(req) {
  await initDb();
  const body = await req.json();
  const k = parseInt(body.k, 10);
  
  if (!k || k < 1 || k > 5) {
    return NextResponse.json({ error: 'Invalid number of rooms. Must be between 1 and 5.' }, { status: 400 });
  }

  const allRooms = await Room.findAll({ order: [['floor', 'ASC'], ['roomIndex', 'ASC']] });
  const availableRooms = allRooms.filter(r => r.status === 'available');

  if (availableRooms.length < k) {
    return NextResponse.json({ error: 'Not enough available rooms' }, { status: 400 });
  }

  // Step 1: Same floor priority
  let bestSameFloorSubset = null;
  let minSameFloorCost = Infinity;

  for (let f = 1; f <= 10; f++) {
    let floorRooms = availableRooms.filter(r => r.floor === f).sort((a,b) => a.roomIndex - b.roomIndex);
    for (let i = 0; i <= floorRooms.length - k; i++) {
      let subset = floorRooms.slice(i, i + k);
      let cost = subset[k-1].roomIndex - subset[0].roomIndex;
      if (cost < minSameFloorCost) {
        minSameFloorCost = cost;
        bestSameFloorSubset = subset;
      }
    }
  }

  if (bestSameFloorSubset) {
    const roomIds = bestSameFloorSubset.map(r => r.id);
    await Room.update({ status: 'occupied' }, { where: { id: roomIds } });
    return NextResponse.json({ booked: roomIds });
  }

  // Step 2: Spanning across floors
  let sortedRooms = [...availableRooms].sort((a, b) => {
    if (a.floor !== b.floor) return a.floor - b.floor;
    return a.roomIndex - b.roomIndex;
  });

  let minBoundingCost = Infinity;
  let candidatePairs = [];

  for (let i = 0; i <= sortedRooms.length - k; i++) {
    for (let j = i + k - 1; j < sortedRooms.length; j++) {
      let A = sortedRooms[i];
      let B = sortedRooms[j];
      let cost = A.roomIndex + Math.abs(A.floor - B.floor) * 2 + B.roomIndex;
      
      if (cost < minBoundingCost) {
        minBoundingCost = cost;
        candidatePairs = [{i, j}];
      } else if (cost === minBoundingCost) {
        candidatePairs.push({i, j});
      }
    }
  }

  let bestMultiFloorSubset = null;
  let minSeqCost = Infinity;

  for (let pair of candidatePairs) {
    let A = sortedRooms[pair.i];
    let B = sortedRooms[pair.j];
    let intermediatePool = sortedRooms.slice(pair.i + 1, pair.j);
    
    let combos = getCombinations(intermediatePool, k - 2);
    
    for (let combo of combos) {
      let subset = [A, ...combo, B];
      let seqCost = 0;
      for (let idx = 0; idx < subset.length - 1; idx++) {
        seqCost += getDist(subset[idx], subset[idx+1]);
      }
      
      if (seqCost < minSeqCost) {
        minSeqCost = seqCost;
        bestMultiFloorSubset = subset;
      }
    }
  }

  if (bestMultiFloorSubset) {
    const roomIds = bestMultiFloorSubset.map(r => r.id);
    await Room.update({ status: 'occupied' }, { where: { id: roomIds } });
    return NextResponse.json({ booked: roomIds });
  }

  return NextResponse.json({ error: 'Could not find a valid combination' }, { status: 500 });
}
