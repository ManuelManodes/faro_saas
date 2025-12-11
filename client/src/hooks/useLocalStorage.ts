import { useState, useEffect } from "react";

export function useLocalStorage<T extends { id: string }>(key: string, initialValue: T[] = []) {
    const [data, setData] = useState<T[]>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(data));
    }, [key, data]);

    const add = (item: Omit<T, "id">) => {
        const newItem = { ...item, id: crypto.randomUUID() } as T;
        setData((prev) => [...prev, newItem]);
        return newItem;
    };

    const update = (id: string, updates: Partial<T>) => {
        setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };

    const remove = (id: string) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    };

    return { data, add, update, remove };
}
