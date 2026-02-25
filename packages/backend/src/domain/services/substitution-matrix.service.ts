import { Injectable } from '@nestjs/common';

export interface SubstitutionRule {
  ingredient: string;
  substitutes: Array<{ name: string; confidence: number }>;
}

@Injectable()
export class SubstitutionMatrixService {
  private substitutionMap: Map<string, Array<{ name: string; confidence: number }>>;

  constructor() {
    this.substitutionMap = new Map();
    this.initializeSubstitutions();
  }

  private initializeSubstitutions(): void {
    const substitutions: Record<string, Array<{ name: string; confidence: number }>> = {
      'onion': [
        { name: 'shallot', confidence: 0.9 },
        { name: 'leek', confidence: 0.7 },
        { name: 'scallion', confidence: 0.6 },
        { name: 'green onion', confidence: 0.6 }
      ],
      'butter': [
        { name: 'margarine', confidence: 0.85 },
        { name: 'olive oil', confidence: 0.7 },
        { name: 'coconut oil', confidence: 0.6 },
        { name: 'ghee', confidence: 0.8 }
      ],
      'tomato': [
        { name: 'tomato paste', confidence: 0.7 },
        { name: 'crushed tomatoes', confidence: 0.9 },
        { name: 'cherry tomatoes', confidence: 0.8 },
        { name: 'sun-dried tomatoes', confidence: 0.6 }
      ],
      'milk': [
        { name: 'almond milk', confidence: 0.8 },
        { name: 'soy milk', confidence: 0.8 },
        { name: 'oat milk', confidence: 0.8 },
        { name: 'coconut milk', confidence: 0.7 },
        { name: 'cream', confidence: 0.6 }
      ],
      'chicken breast': [
        { name: 'chicken thigh', confidence: 0.9 },
        { name: 'turkey breast', confidence: 0.8 },
        { name: 'chicken', confidence: 1.0 },
        { name: 'tofu', confidence: 0.5 }
      ],
      'chicken': [
        { name: 'chicken breast', confidence: 1.0 },
        { name: 'chicken thigh', confidence: 0.95 },
        { name: 'turkey', confidence: 0.8 }
      ],
      'flour': [
        { name: 'all-purpose flour', confidence: 0.95 },
        { name: 'bread flour', confidence: 0.8 },
        { name: 'whole wheat flour', confidence: 0.7 },
        { name: 'almond flour', confidence: 0.5 }
      ],
      'sugar': [
        { name: 'brown sugar', confidence: 0.9 },
        { name: 'honey', confidence: 0.7 },
        { name: 'maple syrup', confidence: 0.7 },
        { name: 'agave nectar', confidence: 0.7 }
      ],
      'soy sauce': [
        { name: 'tamari', confidence: 0.95 },
        { name: 'coconut aminos', confidence: 0.8 },
        { name: 'worcestershire sauce', confidence: 0.6 }
      ],
      'olive oil': [
        { name: 'vegetable oil', confidence: 0.85 },
        { name: 'canola oil', confidence: 0.85 },
        { name: 'avocado oil', confidence: 0.8 },
        { name: 'butter', confidence: 0.7 }
      ],
      'garlic': [
        { name: 'garlic powder', confidence: 0.7 },
        { name: 'shallot', confidence: 0.5 }
      ],
      'lemon juice': [
        { name: 'lime juice', confidence: 0.9 },
        { name: 'vinegar', confidence: 0.7 },
        { name: 'lemon', confidence: 1.0 }
      ],
      'beef': [
        { name: 'ground beef', confidence: 0.95 },
        { name: 'beef chuck', confidence: 0.9 },
        { name: 'lamb', confidence: 0.7 },
        { name: 'pork', confidence: 0.6 }
      ],
      'rice': [
        { name: 'white rice', confidence: 0.95 },
        { name: 'brown rice', confidence: 0.9 },
        { name: 'jasmine rice', confidence: 0.9 },
        { name: 'basmati rice', confidence: 0.9 },
        { name: 'quinoa', confidence: 0.6 }
      ],
      'pasta': [
        { name: 'spaghetti', confidence: 0.9 },
        { name: 'penne', confidence: 0.9 },
        { name: 'linguine', confidence: 0.9 },
        { name: 'fettuccine', confidence: 0.9 }
      ],
      'cheese': [
        { name: 'cheddar cheese', confidence: 0.8 },
        { name: 'mozzarella', confidence: 0.8 },
        { name: 'parmesan', confidence: 0.8 }
      ],
      'cream': [
        { name: 'heavy cream', confidence: 0.95 },
        { name: 'half and half', confidence: 0.8 },
        { name: 'milk', confidence: 0.6 }
      ],
      'eggs': [
        { name: 'egg substitute', confidence: 0.8 },
        { name: 'flax eggs', confidence: 0.6 }
      ],
      'yogurt': [
        { name: 'greek yogurt', confidence: 0.95 },
        { name: 'sour cream', confidence: 0.8 }
      ],
      'carrot': [
        { name: 'carrots', confidence: 1.0 },
        { name: 'sweet potato', confidence: 0.5 }
      ],
      'potato': [
        { name: 'potatoes', confidence: 1.0 },
        { name: 'sweet potato', confidence: 0.7 }
      ],
      'bell pepper': [
        { name: 'red bell pepper', confidence: 0.95 },
        { name: 'green bell pepper', confidence: 0.95 },
        { name: 'yellow bell pepper', confidence: 0.95 }
      ],
      'cilantro': [
        { name: 'parsley', confidence: 0.7 },
        { name: 'coriander', confidence: 1.0 }
      ],
      'basil': [
        { name: 'oregano', confidence: 0.6 },
        { name: 'thai basil', confidence: 0.9 }
      ],
      'ginger': [
        { name: 'ground ginger', confidence: 0.8 },
        { name: 'ginger powder', confidence: 0.8 }
      ],
      'vinegar': [
        { name: 'apple cider vinegar', confidence: 0.9 },
        { name: 'white vinegar', confidence: 0.9 },
        { name: 'red wine vinegar', confidence: 0.9 },
        { name: 'lemon juice', confidence: 0.7 }
      ]
    };

    // Populate the map
    Object.entries(substitutions).forEach(([ingredient, subs]) => {
      this.substitutionMap.set(ingredient.toLowerCase(), subs);
    });
  }

  getSubstitutes(ingredient: string): Array<{ name: string; confidence: number }> {
    const normalized = ingredient.toLowerCase().trim();
    return this.substitutionMap.get(normalized) || [];
  }

  canSubstitute(ingredient1: string, ingredient2: string): boolean {
    const subs = this.getSubstitutes(ingredient1);
    return subs.some(s => s.name.toLowerCase() === ingredient2.toLowerCase());
  }

  getConfidence(original: string, substitute: string): number {
    const subs = this.getSubstitutes(original);
    const match = subs.find(s => s.name.toLowerCase() === substitute.toLowerCase());
    return match?.confidence || 0;
  }

  getAllIngredients(): string[] {
    return Array.from(this.substitutionMap.keys());
  }
}
