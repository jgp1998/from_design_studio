import { WorkOrder, Product } from './types';

export const mockWorkOrders: WorkOrder[] = [
    {
        id: 'WO-001',
        clientId: 'client-1',
        fileName: 'mechanical_gear.stl',
        material: 'PLA',
        color: 'Blue',
        tolerance: '±0.1mm',
        quantity: 50,
        details: 'Industrial gear for machinery. Requires high precision.',
        status: 'waiting_offers',
        createdAt: '2026-03-10',
        offers: [
            {
                id: 'offer-1',
                providerId: 'provider-1',
                providerName: 'Provider A',
                price: 450,
                deliveryTime: 5,
                status: 'pending',
                createdAt: '2026-03-11'
            },
            {
                id: 'offer-2',
                providerId: 'provider-2',
                providerName: 'Provider B',
                price: 520,
                deliveryTime: 3,
                status: 'pending',
                createdAt: '2026-03-11'
            },
            {
                id: 'offer-3',
                providerId: 'provider-3',
                providerName: 'Provider C',
                price: 380,
                deliveryTime: 7,
                status: 'pending',
                createdAt: '2026-03-12'
            }
        ]
    },
    {
        id: 'WO-002',
        clientId: 'client-1',
        fileName: 'custom_bracket.obj',
        material: 'PETG',
        color: 'Black',
        tolerance: '±0.2mm',
        quantity: 100,
        details: 'Mounting brackets for electronic equipment.',
        status: 'in_production',
        createdAt: '2026-03-05',
        offers: []
    },
    {
        id: 'WO-003',
        clientId: 'client-1',
        fileName: 'prototype_housing.stl',
        material: 'Resin',
        color: 'White',
        tolerance: '±0.05mm',
        quantity: 10,
        details: 'High precision prototype housing for testing.',
        status: 'dispatched',
        createdAt: '2026-03-01',
        offers: []
    }
];

export const mockAvailableWorkOrders: WorkOrder[] = [
    {
        id: 'WO-104',
        clientId: 'client-5',
        fileName: 'industrial_valve.stl',
        material: 'ABS',
        color: 'Gray',
        tolerance: '±0.15mm',
        quantity: 75,
        details: 'Industrial valve components. Must withstand high temperatures.',
        status: 'waiting_offers',
        createdAt: '2026-03-14',
        offers: []
    },
    {
        id: 'WO-105',
        clientId: 'client-6',
        fileName: 'medical_prototype.obj',
        material: 'Resin',
        color: 'White',
        tolerance: '±0.05mm',
        quantity: 20,
        details: 'Medical device prototype. FDA-compliant material required.',
        status: 'waiting_offers',
        createdAt: '2026-03-13',
        offers: []
    },
    {
        id: 'WO-106',
        clientId: 'client-7',
        fileName: 'drone_frame.stl',
        material: 'PETG',
        color: 'Black',
        tolerance: '±0.2mm',
        quantity: 30,
        details: 'Lightweight drone frame parts. Strength is critical.',
        status: 'waiting_offers',
        createdAt: '2026-03-15',
        offers: []
    }
];

export const mockProducts: Product[] = [
    {
        id: 'prod-1',
        name: 'Modular Storage Box',
        description: 'Customizable modular storage solution perfect for organizing small parts, tools, and components.',
        category: 'Organization',
        basePrice: 25,
        imageUrl: 'https://images.pexels.com/photos/1181376/pexels-photo-1181376.jpeg',
        materials: ['PLA', 'PETG', 'ABS'],
        sizes: ['Small', 'Medium', 'Large'],
        colors: ['Red', 'Blue', 'Black', 'White', 'Gray']
    },
    {
        id: 'prod-2',
        name: 'Phone Stand Pro',
        description: 'Ergonomic adjustable phone stand with cable management. Compatible with all smartphone sizes.',
        category: 'Accessories',
        basePrice: 18,
        imageUrl: 'https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg',
        materials: ['PLA', 'PETG'],
        sizes: ['Small', 'Medium'],
        colors: ['Red', 'Blue', 'Black', 'White']
    },
    {
        id: 'prod-3',
        name: 'Cable Management Clips',
        description: 'Set of 20 cable management clips. Keep your workspace organized and cables tidy.',
        category: 'Organization',
        basePrice: 12,
        imageUrl: 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg',
        materials: ['PLA', 'ABS'],
        sizes: ['Small'],
        colors: ['Black', 'White', 'Gray']
    },
    {
        id: 'prod-4',
        name: 'Industrial Bearing Mount',
        description: 'High-precision bearing mount for industrial machinery. Designed for long-term durability.',
        category: 'Industrial',
        basePrice: 45,
        imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg',
        materials: ['ABS', 'PETG'],
        sizes: ['Medium', 'Large'],
        colors: ['Black', 'Gray']
    },
    {
        id: 'prod-5',
        name: 'Prototype Enclosure',
        description: 'Versatile electronic project enclosure. Perfect for Arduino, Raspberry Pi, and custom PCBs.',
        category: 'Electronics',
        basePrice: 32,
        imageUrl: 'https://images.pexels.com/photos/442152/pexels-photo-442152.jpeg',
        materials: ['ABS', 'PETG'],
        sizes: ['Small', 'Medium', 'Large'],
        colors: ['Black', 'Gray', 'White']
    },
    {
        id: 'prod-6',
        name: 'Ergonomic Desk Organizer',
        description: 'Multi-compartment desk organizer designed for maximum efficiency and style.',
        category: 'Organization',
        basePrice: 28,
        imageUrl: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg',
        materials: ['PLA', 'PETG'],
        sizes: ['Medium', 'Large'],
        colors: ['Red', 'Blue', 'Black', 'White', 'Gray']
    }
];
