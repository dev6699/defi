import { Token } from "@/hooks/useTokenPair"

type Node = {
    token: Token
    neighbor?: Set<Address>
}
export type Graph = Map<string, Node>
export type Address = `0x${string}`

export const addNode = (graph: Graph, token: Token) => {
    graph.set(token.address, { token, neighbor: new Set() });
}

export const connectNodes = (graph: Graph, tokenA: Token, tokenB: Token) => {
    graph.get(tokenA.address)?.neighbor!.add(tokenB.address);
    graph.get(tokenB.address)?.neighbor!.add(tokenA.address);
}

export const buildGraphFromEdges = (edges: [Token, Token][]) => edges.reduce(
    (graph, [tokenA, tokenB]) => {
        if (!graph.has(tokenA.address)) {
            addNode(graph, tokenA);
        }
        if (!graph.has(tokenB.address)) {
            addNode(graph, tokenB);
        }
        connectNodes(graph, tokenA, tokenB);
        return graph;
    }, new Map() as Graph
);

const dfs = (
    address1: Address,
    address2: Address,
    graph: Graph,
    visited: Set<Address>,
    path: Address[],
    result: Address[][]
) => {
    if (address1 === address2) {
        result.push([...path]);
        return;
    }
    visited.add(address1);
    graph.get(address1)?.neighbor!.forEach(address => {
        if (!visited.has(address) && !path.includes(address)) {
            path.push(address);
            dfs(address, address2, graph, visited, path, result);
            path.pop();
        }
    })
    visited.delete(address1);
}

export const findAllPaths = (address1: Address, address2: Address, graph: Graph) => {
    if (!graph.has(address1) || !graph.has(address2)) {
        return [];
    }
    const path: Address[] = [];
    const visited = new Set<Address>();
    path.push(address1);
    const result: Address[][] = [];
    dfs(address1, address2, graph, visited, path, result);
    return result;
}