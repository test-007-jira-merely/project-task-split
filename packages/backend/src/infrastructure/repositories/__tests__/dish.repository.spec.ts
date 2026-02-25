import { Test, TestingModule } from '@nestjs/testing';
import { DishRepository } from '../dish.repository';
import { PrismaService } from '../../database/prisma.service';
import { DishCategory } from '@meal-platform/shared';

describe('DishRepository', () => {
  let repository: DishRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    dish: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DishRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<DishRepository>(DishRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find a dish by ID', async () => {
      const mockDish = {
        id: 'test-id',
        name: 'Test Dish',
        description: 'Test description',
        imageUrl: 'https://example.com/image.jpg',
        category: 'lunch' as DishCategory,
        difficulty: 2,
        prepTime: 15,
        cookTime: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [],
        instructions: [],
        nutrition: {},
      };

      mockPrismaService.dish.findUnique.mockResolvedValue(mockDish);

      const result = await repository.findById('test-id');

      expect(mockPrismaService.dish.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        include: {
          ingredients: true,
          instructions: true,
          nutrition: true,
        },
      });
      expect(result).toEqual(mockDish);
    });

    it('should return null when dish not found', async () => {
      mockPrismaService.dish.findUnique.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all dishes with default pagination', async () => {
      const mockDishes = [
        { id: '1', name: 'Dish 1' },
        { id: '2', name: 'Dish 2' },
      ];

      mockPrismaService.dish.findMany.mockResolvedValue(mockDishes);

      const result = await repository.findAll({});

      expect(mockPrismaService.dish.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: {},
        include: {
          ingredients: true,
          instructions: true,
          nutrition: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockDishes);
    });

    it('should respect pagination parameters', async () => {
      mockPrismaService.dish.findMany.mockResolvedValue([]);

      await repository.findAll({ page: 2, limit: 10 });

      expect(mockPrismaService.dish.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );
    });

    it('should filter by category', async () => {
      mockPrismaService.dish.findMany.mockResolvedValue([]);

      await repository.findAll({ category: 'breakfast' });

      expect(mockPrismaService.dish.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: 'breakfast' },
        })
      );
    });

    it('should filter by difficulty', async () => {
      mockPrismaService.dish.findMany.mockResolvedValue([]);

      await repository.findAll({ difficulty: 2 });

      expect(mockPrismaService.dish.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { difficulty: 2 },
        })
      );
    });

    it('should filter by max difficulty', async () => {
      mockPrismaService.dish.findMany.mockResolvedValue([]);

      await repository.findAll({ maxDifficulty: 3 });

      expect(mockPrismaService.dish.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { difficulty: { lte: 3 } },
        })
      );
    });

    it('should combine multiple filters', async () => {
      mockPrismaService.dish.findMany.mockResolvedValue([]);

      await repository.findAll({
        category: 'dinner',
        maxDifficulty: 2,
        page: 1,
        limit: 15,
      });

      expect(mockPrismaService.dish.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            category: 'dinner',
            difficulty: { lte: 2 },
          },
          skip: 0,
          take: 15,
        })
      );
    });
  });

  describe('findRandom', () => {
    it('should return a random dish', async () => {
      const mockDish = { id: 'random-id', name: 'Random Dish' };
      mockPrismaService.dish.count.mockResolvedValue(10);
      mockPrismaService.dish.findMany.mockResolvedValue([mockDish]);

      const result = await repository.findRandom({});

      expect(mockPrismaService.dish.count).toHaveBeenCalled();
      expect(mockPrismaService.dish.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockDish);
    });

    it('should exclude specified IDs', async () => {
      mockPrismaService.dish.count.mockResolvedValue(10);
      mockPrismaService.dish.findMany.mockResolvedValue([{ id: 'dish' }]);

      await repository.findRandom({ excludeIds: ['id1', 'id2'] });

      expect(mockPrismaService.dish.count).toHaveBeenCalledWith({
        where: {
          id: { notIn: ['id1', 'id2'] },
        },
      });
    });

    it('should filter by category', async () => {
      mockPrismaService.dish.count.mockResolvedValue(5);
      mockPrismaService.dish.findMany.mockResolvedValue([{ id: 'dish' }]);

      await repository.findRandom({ category: 'breakfast' });

      expect(mockPrismaService.dish.count).toHaveBeenCalledWith({
        where: { category: 'breakfast' },
      });
    });

    it('should return null when no dishes available', async () => {
      mockPrismaService.dish.count.mockResolvedValue(0);

      const result = await repository.findRandom({});

      expect(result).toBeNull();
      expect(mockPrismaService.dish.findMany).not.toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should count all dishes', async () => {
      mockPrismaService.dish.count.mockResolvedValue(42);

      const result = await repository.count();

      expect(mockPrismaService.dish.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(result).toBe(42);
    });

    it('should count dishes with filters', async () => {
      mockPrismaService.dish.count.mockResolvedValue(10);

      const result = await repository.count({ category: 'dinner' });

      expect(mockPrismaService.dish.count).toHaveBeenCalledWith({
        where: { category: 'dinner' },
      });
      expect(result).toBe(10);
    });
  });

  describe('getAllIngredients', () => {
    it('should return all unique ingredients', async () => {
      const mockDishes = [
        {
          ingredients: [
            { name: 'chicken' },
            { name: 'onion' },
          ],
        },
        {
          ingredients: [
            { name: 'chicken' },
            { name: 'garlic' },
          ],
        },
      ];

      mockPrismaService.dish.findMany.mockResolvedValue(mockDishes);

      const result = await repository.getAllIngredients();

      expect(result).toContain('chicken');
      expect(result).toContain('onion');
      expect(result).toContain('garlic');
      expect(new Set(result).size).toBe(result.length); // Check uniqueness
    });

    it('should handle empty database', async () => {
      mockPrismaService.dish.findMany.mockResolvedValue([]);

      const result = await repository.getAllIngredients();

      expect(result).toEqual([]);
    });
  });
});
