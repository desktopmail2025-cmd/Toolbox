import React, { useState, useMemo } from 'react';
import { sounds } from '../../utils/audio';
import {
  BookOpen, Calculator, Copy, Check, Filter, Search, Sparkles,
  Layers, ArrowRight, Atom, Dna, TrendingUp, Compass, Award,
  Cpu, Globe2, ShieldCheck, Flame, RotateCcw
} from 'lucide-react';

export type SubjectId = 'all' | 'math' | 'physics' | 'chemistry' | 'biology' | 'economics' | 'cs' | 'earth';
export type GradeLevel = 'all' | 'middle' | 'high' | 'senior' | 'college';

export interface SubjectFormula {
  id: string;
  name: string;
  subject: SubjectId;
  subjectLabel: string;
  grade: GradeLevel;
  gradeLabel: string;
  topic: string;
  formulaLatex: string;
  description: string;
  variables: { name: string; symbol: string; unit: string; defaultValue: number; step?: number }[];
  calculate: (vals: Record<string, number>) => { result: number; unit: string; steps: string };
}

export const FORMULA_DATABASE: SubjectFormula[] = [
  // ==========================================
  // --- 1. MATHEMATICS ---
  // ==========================================
  {
    id: 'math-quad',
    name: 'Quadratic Formula & Roots',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Algebra',
    formulaLatex: 'x = (-b ± √(b² - 4ac)) / (2a)',
    description: 'Finds real or complex roots of any quadratic equation ax² + bx + c = 0.',
    variables: [
      { name: 'Coefficient a', symbol: 'a', unit: '', defaultValue: 1, step: 0.5 },
      { name: 'Coefficient b', symbol: 'b', unit: '', defaultValue: -5, step: 0.5 },
      { name: 'Constant c', symbol: 'c', unit: '', defaultValue: 6, step: 0.5 },
    ],
    calculate: (v) => {
      const disc = v.b * v.b - 4 * v.a * v.c;
      if (disc < 0) {
        const real = (-v.b / (2 * v.a)).toFixed(3);
        const imag = (Math.sqrt(Math.abs(disc)) / (2 * v.a)).toFixed(3);
        return {
          result: 0,
          unit: `${real} ± ${imag}i (Complex)`,
          steps: `Discriminant Δ = (${v.b})² - 4(${v.a})(${v.c}) = ${disc} < 0. Two complex conjugate roots exist.`,
        };
      }
      const x1 = (-v.b + Math.sqrt(disc)) / (2 * v.a);
      const x2 = (-v.b - Math.sqrt(disc)) / (2 * v.a);
      return {
        result: x1,
        unit: `x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`,
        steps: `Δ = b² - 4ac = ${disc}. √Δ = ${Math.sqrt(disc).toFixed(3)}. x₁ = (${-v.b} + ${Math.sqrt(disc).toFixed(3)}) / ${2 * v.a} = ${x1.toFixed(3)}. x₂ = (${-v.b} - ${Math.sqrt(disc).toFixed(3)}) / ${2 * v.a} = ${x2.toFixed(3)}.`,
      };
    },
  },
  {
    id: 'math-pyth',
    name: 'Pythagorean Theorem',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'middle',
    gradeLabel: 'Middle School (Grades 6-8)',
    topic: 'Geometry',
    formulaLatex: 'c = √(a² + b²)',
    description: 'Calculates the hypotenuse c of a right-angled triangle given perpendicular sides a and b.',
    variables: [
      { name: 'Side a', symbol: 'a', unit: 'm', defaultValue: 3 },
      { name: 'Side b', symbol: 'b', unit: 'm', defaultValue: 4 },
    ],
    calculate: (v) => {
      const c = Math.sqrt(v.a * v.a + v.b * v.b);
      return {
        result: c,
        unit: 'm',
        steps: `c = √(${v.a}² + ${v.b}²) = √(${v.a * v.a} + ${v.b * v.b}) = √${v.a * v.a + v.b * v.b} = ${c.toFixed(3)} m`,
      };
    },
  },
  {
    id: 'math-circle-area',
    name: 'Area of Circle',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'middle',
    gradeLabel: 'Middle School (Grades 6-8)',
    topic: 'Geometry',
    formulaLatex: 'A = π × r²',
    description: 'Calculates 2D planar surface enclosed by a circle of radius r.',
    variables: [
      { name: 'Radius r', symbol: 'r', unit: 'cm', defaultValue: 7 },
    ],
    calculate: (v) => {
      const area = Math.PI * v.r * v.r;
      return {
        result: area,
        unit: 'cm²',
        steps: `A = π × (${v.r})² = 3.14159 × ${v.r * v.r} = ${area.toFixed(3)} cm²`,
      };
    },
  },
  {
    id: 'math-cylinder-vol',
    name: 'Volume of Cylinder',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'middle',
    gradeLabel: 'Middle School (Grades 6-8)',
    topic: 'Geometry',
    formulaLatex: 'V = π × r² × h',
    description: 'Calculates 3D interior capacity of a circular cylinder given radius r and height h.',
    variables: [
      { name: 'Radius r', symbol: 'r', unit: 'cm', defaultValue: 5 },
      { name: 'Height h', symbol: 'h', unit: 'cm', defaultValue: 12 },
    ],
    calculate: (v) => {
      const vol = Math.PI * v.r * v.r * v.h;
      return {
        result: vol,
        unit: 'cm³',
        steps: `V = π × (${v.r})² × ${v.h} = π × ${v.r * v.r} × ${v.h} = ${vol.toFixed(3)} cm³`,
      };
    },
  },
  {
    id: 'math-sphere-area',
    name: 'Surface Area of Sphere',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Geometry',
    formulaLatex: 'A = 4 × π × r²',
    description: 'Total outer surface area wrapping a 3-dimensional sphere.',
    variables: [
      { name: 'Radius r', symbol: 'r', unit: 'cm', defaultValue: 6 },
    ],
    calculate: (v) => {
      const area = 4 * Math.PI * v.r * v.r;
      return {
        result: area,
        unit: 'cm²',
        steps: `A = 4 × π × (${v.r})² = 4 × 3.14159 × ${v.r * v.r} = ${area.toFixed(3)} cm²`,
      };
    },
  },
  {
    id: 'math-heron',
    name: "Heron's Formula for Any Triangle",
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Geometry',
    formulaLatex: 'A = √(s(s-a)(s-b)(s-c)), where s = (a+b+c)/2',
    description: 'Calculates the area of any triangle from its three side lengths without requiring angles or height.',
    variables: [
      { name: 'Side a', symbol: 'a', unit: 'm', defaultValue: 7 },
      { name: 'Side b', symbol: 'b', unit: 'm', defaultValue: 8 },
      { name: 'Side c', symbol: 'c', unit: 'm', defaultValue: 9 },
    ],
    calculate: (v) => {
      const s = (v.a + v.b + v.c) / 2;
      const term = s * (s - v.a) * (s - v.b) * (s - v.c);
      if (term <= 0) {
        return { result: 0, unit: 'Invalid triangle', steps: 'Side lengths violate triangle inequality (a + b > c).' };
      }
      const area = Math.sqrt(term);
      return {
        result: area,
        unit: 'm²',
        steps: `Semiperimeter s = (${v.a}+${v.b}+${v.c})/2 = ${s}. A = √(${s} × ${s - v.a} × ${s - v.b} × ${s - v.c}) = √${term.toFixed(2)} = ${area.toFixed(3)} m²`,
      };
    },
  },
  {
    id: 'math-cosines',
    name: 'Law of Cosines (Side c)',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Trigonometry',
    formulaLatex: 'c = √(a² + b² - 2ab × cos(γ))',
    description: 'Finds opposite side c given adjacent sides a, b and interior angle γ in degrees.',
    variables: [
      { name: 'Side a', symbol: 'a', unit: 'm', defaultValue: 5 },
      { name: 'Side b', symbol: 'b', unit: 'm', defaultValue: 7 },
      { name: 'Angle γ (degrees)', symbol: 'gamma', unit: '°', defaultValue: 60 },
    ],
    calculate: (v) => {
      const rad = (v.gamma * Math.PI) / 180;
      const cosVal = Math.cos(rad);
      const c2 = v.a * v.a + v.b * v.b - 2 * v.a * v.b * cosVal;
      const c = Math.sqrt(Math.max(0, c2));
      return {
        result: c,
        unit: 'm',
        steps: `cos(${v.gamma}°) = ${cosVal.toFixed(4)}. c² = ${v.a}² + ${v.b}² - 2(${v.a})(${v.b})(${cosVal.toFixed(4)}) = ${c2.toFixed(3)}. c = ${c.toFixed(3)} m`,
      };
    },
  },
  {
    id: 'math-arithmetic-sum',
    name: 'Arithmetic Series Sum S_n',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Sequences & Series',
    formulaLatex: 'S_n = (n / 2) × [2a₁ + (n - 1)d]',
    description: 'Finds the cumulative sum of the first n terms of an arithmetic progression with common difference d.',
    variables: [
      { name: 'First term a₁', symbol: 'a', unit: '', defaultValue: 3 },
      { name: 'Common difference d', symbol: 'd', unit: '', defaultValue: 4 },
      { name: 'Number of terms n', symbol: 'n', unit: '', defaultValue: 20 },
    ],
    calculate: (v) => {
      const sn = (v.n / 2) * (2 * v.a + (v.n - 1) * v.d);
      const an = v.a + (v.n - 1) * v.d;
      return {
        result: sn,
        unit: `Total Sum (Term a_${v.n} = ${an})`,
        steps: `Last term a_${v.n} = ${v.a} + (${v.n}-1)×${v.d} = ${an}. S_${v.n} = (${v.n}/2) × (${v.a} + ${an}) = ${sn}`,
      };
    },
  },
  {
    id: 'math-geom-sum',
    name: 'Finite Geometric Series Sum',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Sequences & Series',
    formulaLatex: 'S_n = a₁ × (1 - r^n) / (1 - r)',
    description: 'Finds total sum of n terms where each consecutive term is multiplied by common ratio r.',
    variables: [
      { name: 'First term a₁', symbol: 'a', unit: '', defaultValue: 2 },
      { name: 'Common ratio r', symbol: 'r', unit: '', defaultValue: 1.5, step: 0.1 },
      { name: 'Number of terms n', symbol: 'n', unit: '', defaultValue: 8 },
    ],
    calculate: (v) => {
      if (v.r === 1) {
        const sum = v.a * v.n;
        return { result: sum, unit: '', steps: `r = 1, so S_n = a × n = ${v.a} × ${v.n} = ${sum}` };
      }
      const sum = (v.a * (1 - Math.pow(v.r, v.n))) / (1 - v.r);
      return {
        result: sum,
        unit: '',
        steps: `S_${v.n} = ${v.a} × (1 - ${v.r}^${v.n}) / (1 - ${v.r}) = ${v.a} × (1 - ${Math.pow(v.r, v.n).toFixed(4)}) / (${(1 - v.r).toFixed(4)}) = ${sum.toFixed(3)}`,
      };
    },
  },
  {
    id: 'math-perm',
    name: 'Permutations P(n, r)',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Combinatorics',
    formulaLatex: 'P(n, r) = n! / (n - r)!',
    description: 'Number of ordered arrangements of r elements chosen from n distinct items without repetition.',
    variables: [
      { name: 'Total items n', symbol: 'n', unit: '', defaultValue: 7 },
      { name: 'Chosen items r', symbol: 'r', unit: '', defaultValue: 3 },
    ],
    calculate: (v) => {
      const fact = (num: number): number => (num <= 1 ? 1 : num * fact(num - 1));
      const n = Math.min(20, Math.max(0, Math.floor(v.n)));
      const r = Math.min(n, Math.max(0, Math.floor(v.r)));
      const p = fact(n) / fact(n - r);
      return {
        result: p,
        unit: 'arrangements',
        steps: `P(${n}, ${r}) = ${n}! / (${n} - ${r})! = ${n}! / ${n - r}! = ${p.toLocaleString()} distinct permutations.`,
      };
    },
  },
  {
    id: 'math-comb',
    name: 'Combinations C(n, r)',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Combinatorics',
    formulaLatex: 'C(n, r) = n! / [r! × (n - r)!]',
    description: 'Number of unordered subsets of size r selected from a collection of n items.',
    variables: [
      { name: 'Total items n', symbol: 'n', unit: '', defaultValue: 10 },
      { name: 'Chosen items r', symbol: 'r', unit: '', defaultValue: 4 },
    ],
    calculate: (v) => {
      const fact = (num: number): number => (num <= 1 ? 1 : num * fact(num - 1));
      const n = Math.min(20, Math.max(0, Math.floor(v.n)));
      const r = Math.min(n, Math.max(0, Math.floor(v.r)));
      const c = fact(n) / (fact(r) * fact(n - r));
      return {
        result: c,
        unit: 'subsets',
        steps: `C(${n}, ${r}) = ${n}! / [${r}! × ${n - r}!] = ${c.toLocaleString()} unique combinations.`,
      };
    },
  },
  {
    id: 'math-zscore',
    name: 'Normal Distribution Z-Score',
    subject: 'math',
    subjectLabel: 'Mathematics',
    grade: 'college',
    gradeLabel: 'College & AP Statistics',
    topic: 'Statistics',
    formulaLatex: 'z = (X - μ) / σ',
    description: 'Measures how many standard deviations a raw observation X lies above or below the mean μ.',
    variables: [
      { name: 'Observed value X', symbol: 'x', unit: '', defaultValue: 85 },
      { name: 'Population mean μ', symbol: 'mu', unit: '', defaultValue: 70 },
      { name: 'Standard deviation σ', symbol: 'sigma', unit: '', defaultValue: 10 },
    ],
    calculate: (v) => {
      if (v.sigma === 0) return { result: 0, unit: 'Undefined (σ = 0)', steps: 'Standard deviation must be non-zero.' };
      const z = (v.x - v.mu) / v.sigma;
      return {
        result: z,
        unit: 'standard deviations (σ)',
        steps: `z = (${v.x} - ${v.mu}) / ${v.sigma} = ${v.x - v.mu} / ${v.sigma} = ${z.toFixed(3)}. Observation is ${Math.abs(z).toFixed(2)} σ ${z >= 0 ? 'above' : 'below'} the mean.`,
      };
    },
  },

  // ==========================================
  // --- 2. PHYSICS ---
  // ==========================================
  {
    id: 'phys-kin-disp',
    name: 'Kinematic Displacement Equation',
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Kinematics',
    formulaLatex: 's = v₀ × t + 0.5 × a × t²',
    description: 'Distance traveled under constant acceleration a over elapsed time t with initial velocity v₀.',
    variables: [
      { name: 'Initial velocity v₀', symbol: 'v0', unit: 'm/s', defaultValue: 5 },
      { name: 'Acceleration a', symbol: 'a', unit: 'm/s²', defaultValue: 9.8, step: 0.1 },
      { name: 'Time elapsed t', symbol: 't', unit: 's', defaultValue: 3 },
    ],
    calculate: (v) => {
      const s = v.v0 * v.t + 0.5 * v.a * v.t * v.t;
      const vf = v.v0 + v.a * v.t;
      return {
        result: s,
        unit: `m (Final Velocity = ${vf.toFixed(2)} m/s)`,
        steps: `s = (${v.v0})(${v.t}) + 0.5(${v.a})(${v.t})² = ${v.v0 * v.t} + ${0.5 * v.a * v.t * v.t} = ${s.toFixed(2)} m`,
      };
    },
  },
  {
    id: 'phys-newton-2',
    name: "Newton's Second Law of Motion",
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'middle',
    gradeLabel: 'Middle School (Grades 6-8)',
    topic: 'Mechanics',
    formulaLatex: 'F = m × a',
    description: 'Net accelerating force required to produce an acceleration a on a body of mass m.',
    variables: [
      { name: 'Mass m', symbol: 'm', unit: 'kg', defaultValue: 1200 },
      { name: 'Acceleration a', symbol: 'a', unit: 'm/s²', defaultValue: 2.5, step: 0.1 },
    ],
    calculate: (v) => {
      const f = v.m * v.a;
      return {
        result: f,
        unit: 'N (Newtons)',
        steps: `F = ${v.m} kg × ${v.a} m/s² = ${f.toLocaleString()} N`,
      };
    },
  },
  {
    id: 'phys-ke',
    name: 'Kinetic Energy',
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Energy & Work',
    formulaLatex: 'E_k = 0.5 × m × v²',
    description: 'Mechanical energy possessed by an object due to its motion at velocity v.',
    variables: [
      { name: 'Mass m', symbol: 'm', unit: 'kg', defaultValue: 800 },
      { name: 'Velocity v', symbol: 'v', unit: 'm/s', defaultValue: 25 },
    ],
    calculate: (v) => {
      const ke = 0.5 * v.m * v.v * v.v;
      return {
        result: ke,
        unit: `Joules (${(ke / 1000).toFixed(2)} kJ)`,
        steps: `E_k = 0.5 × ${v.m} × (${v.v})² = 0.5 × ${v.m} × ${v.v * v.v} = ${ke.toLocaleString()} J`,
      };
    },
  },
  {
    id: 'phys-gravity',
    name: 'Universal Gravitational Force',
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Gravitation',
    formulaLatex: 'F = G × (m₁ × m₂) / r²',
    description: "Newton's gravitational attraction between two point masses separated by distance r.",
    variables: [
      { name: 'Mass m₁', symbol: 'm1', unit: 'kg', defaultValue: 5.972e24 },
      { name: 'Mass m₂', symbol: 'm2', unit: 'kg', defaultValue: 70 },
      { name: 'Distance r', symbol: 'r', unit: 'm', defaultValue: 6.371e6 },
    ],
    calculate: (v) => {
      const G = 6.6743e-11;
      const f = (G * v.m1 * v.m2) / (v.r * v.r);
      return {
        result: f,
        unit: 'N (Newtons)',
        steps: `F = (6.6743×10⁻¹¹ × ${v.m1.toExponential(2)} × ${v.m2}) / (${v.r.toExponential(2)})² = ${f.toFixed(2)} N`,
      };
    },
  },
  {
    id: 'phys-centripetal',
    name: 'Centripetal Force',
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Mechanics',
    formulaLatex: 'F_c = (m × v²) / r',
    description: 'Inward radial force required to maintain circular motion of radius r at tangential speed v.',
    variables: [
      { name: 'Mass m', symbol: 'm', unit: 'kg', defaultValue: 1000 },
      { name: 'Tangential velocity v', symbol: 'v', unit: 'm/s', defaultValue: 20 },
      { name: 'Radius of curve r', symbol: 'r', unit: 'm', defaultValue: 50 },
    ],
    calculate: (v) => {
      const fc = (v.m * v.v * v.v) / v.r;
      const ac = (v.v * v.v) / v.r;
      return {
        result: fc,
        unit: `N (Acceleration = ${ac.toFixed(2)} m/s²)`,
        steps: `a_c = v²/r = ${v.v * v.v}/${v.r} = ${ac.toFixed(2)} m/s². F_c = m × a_c = ${v.m} × ${ac.toFixed(2)} = ${fc.toLocaleString()} N`,
      };
    },
  },
  {
    id: 'phys-ohm',
    name: "Ohm's Law & Electric Power",
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'middle',
    gradeLabel: 'Middle School (Grades 6-8)',
    topic: 'Circuits & Electricity',
    formulaLatex: 'V = I × R, P = V × I',
    description: 'Relationship between voltage V, current I, resistance R, and dissipated electric power P.',
    variables: [
      { name: 'Current I', symbol: 'i', unit: 'Amperes (A)', defaultValue: 2.5, step: 0.1 },
      { name: 'Resistance R', symbol: 'r', unit: 'Ohms (Ω)', defaultValue: 48, step: 1 },
    ],
    calculate: (v) => {
      const voltage = v.i * v.r;
      const power = voltage * v.i;
      return {
        result: voltage,
        unit: `Volts (Power = ${power.toFixed(2)} Watts)`,
        steps: `V = I × R = ${v.i} A × ${v.r} Ω = ${voltage.toFixed(2)} V. Power P = V × I = ${voltage.toFixed(2)} × ${v.i} = ${power.toFixed(2)} W`,
      };
    },
  },
  {
    id: 'phys-snell',
    name: "Snell's Law of Refraction",
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Optics',
    formulaLatex: 'n₁ × sin(θ₁) = n₂ × sin(θ₂)',
    description: 'Finds refraction angle θ₂ when light transitions across an interface between two optical media.',
    variables: [
      { name: 'Index n₁ (e.g. Air=1.0)', symbol: 'n1', unit: '', defaultValue: 1.0, step: 0.05 },
      { name: 'Incident Angle θ₁', symbol: 'theta1', unit: '°', defaultValue: 45 },
      { name: 'Index n₂ (e.g. Glass=1.5)', symbol: 'n2', unit: '', defaultValue: 1.5, step: 0.05 },
    ],
    calculate: (v) => {
      const rad1 = (v.theta1 * Math.PI) / 180;
      const sinTheta2 = (v.n1 * Math.sin(rad1)) / v.n2;
      if (sinTheta2 > 1) {
        return {
          result: 0,
          unit: 'Total Internal Reflection',
          steps: `sin(θ₂) = ${sinTheta2.toFixed(3)} > 1.0. Critical angle exceeded: light is completely reflected!`,
        };
      }
      const theta2Deg = (Math.asin(sinTheta2) * 180) / Math.PI;
      return {
        result: theta2Deg,
        unit: '° (Refracted Angle)',
        steps: `sin(θ₂) = (${v.n1} × sin(${v.theta1}°)) / ${v.n2} = (${v.n1} × ${Math.sin(rad1).toFixed(4)}) / ${v.n2} = ${sinTheta2.toFixed(4)}. θ₂ = arcsin(${sinTheta2.toFixed(4)}) = ${theta2Deg.toFixed(2)}°`,
      };
    },
  },
  {
    id: 'phys-lens',
    name: 'Thin Lens & Mirror Equation',
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Optics',
    formulaLatex: '1/f = 1/d_o + 1/d_i',
    description: 'Finds image distance d_i and magnification m for an optical lens with focal length f.',
    variables: [
      { name: 'Focal length f', symbol: 'f', unit: 'cm', defaultValue: 10 },
      { name: 'Object distance d_o', symbol: 'do', unit: 'cm', defaultValue: 25 },
    ],
    calculate: (v) => {
      if (v.do === v.f) {
        return { result: 0, unit: 'Image at Infinity', steps: 'Object placed at focal point produces parallel non-converging rays.' };
      }
      const di = (v.f * v.do) / (v.do - v.f);
      const mag = -di / v.do;
      return {
        result: di,
        unit: `cm (Magnification m = ${mag.toFixed(2)}×)`,
        steps: `1/d_i = 1/${v.f} - 1/${v.do} = ${(1 / v.f - 1 / v.do).toFixed(4)}. d_i = ${di.toFixed(2)} cm. Magnification m = -d_i / d_o = ${mag.toFixed(2)} (${mag < 0 ? 'Inverted Real' : 'Upright Virtual'}).`,
      };
    },
  },
  {
    id: 'phys-emc2',
    name: 'Mass-Energy Equivalence (E = mc²)',
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'college',
    gradeLabel: 'College & University',
    topic: 'Modern Physics',
    formulaLatex: 'E = m × c²',
    description: "Einstein's relativistic mass-energy equivalence using speed of light c = 2.998 × 10⁸ m/s.",
    variables: [
      { name: 'Mass m', symbol: 'm', unit: 'kg', defaultValue: 0.001 },
    ],
    calculate: (v) => {
      const c = 299792458;
      const energy = v.m * c * c;
      const megatonsTnt = energy / 4.184e15;
      return {
        result: energy,
        unit: `Joules (${megatonsTnt.toFixed(3)} Megatons TNT)`,
        steps: `E = ${v.m} kg × (2.998×10⁸ m/s)² = ${energy.toExponential(4)} J ≈ ${(energy / 3.6e6).toLocaleString()} kWh`,
      };
    },
  },
  {
    id: 'phys-photon',
    name: 'Planck-Einstein Photon Energy',
    subject: 'physics',
    subjectLabel: 'Physics',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Quantum Physics',
    formulaLatex: 'E = h × f = (h × c) / λ',
    description: 'Quantum energy delivered by an individual light photon of frequency f or wavelength λ.',
    variables: [
      { name: 'Wavelength λ', symbol: 'lambda', unit: 'nm', defaultValue: 550 },
    ],
    calculate: (v) => {
      const h = 6.62607015e-34;
      const c = 299792458;
      const lambdaMeters = v.lambda * 1e-9;
      const energyJoules = (h * c) / lambdaMeters;
      const energyEv = energyJoules / 1.602176634e-19;
      return {
        result: energyEv,
        unit: `eV (${energyJoules.toExponential(3)} J)`,
        steps: `λ = ${v.lambda} nm = ${lambdaMeters.toExponential(2)} m. Frequency f = c/λ = ${(c / lambdaMeters).toExponential(3)} Hz. E = hf = ${energyEv.toFixed(3)} electron-volts.`,
      };
    },
  },

  // ==========================================
  // --- 3. CHEMISTRY ---
  // ==========================================
  {
    id: 'chem-ideal-gas',
    name: 'Ideal Gas Law (PV = nRT)',
    subject: 'chemistry',
    subjectLabel: 'Chemistry',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Gases & Thermodynamics',
    formulaLatex: 'P = (n × R × T) / V',
    description: 'Pressure of ideal gas given moles n, Kelvin temperature T, volume V, and gas constant R = 0.0821 L·atm/(mol·K).',
    variables: [
      { name: 'Molar quantity n', symbol: 'n', unit: 'mol', defaultValue: 2 },
      { name: 'Temperature T', symbol: 't', unit: 'Kelvin (K)', defaultValue: 298.15 },
      { name: 'Container Volume V', symbol: 'v', unit: 'Liters (L)', defaultValue: 10 },
    ],
    calculate: (v) => {
      const R = 0.082057;
      const p = (v.n * R * v.t) / v.v;
      return {
        result: p,
        unit: 'atm (Atmospheres)',
        steps: `P = (${v.n} mol × 0.0821 × ${v.t} K) / ${v.v} L = ${p.toFixed(3)} atm (${(p * 101.325).toFixed(1)} kPa)`,
      };
    },
  },
  {
    id: 'chem-molarity',
    name: 'Molarity of Solution (M)',
    subject: 'chemistry',
    subjectLabel: 'Chemistry',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Solutions & Concentrations',
    formulaLatex: 'M = moles of solute / liters of solution',
    description: 'Determines molar concentration (mol/L) when dissolving solute mass m with molar mass MW.',
    variables: [
      { name: 'Solute Mass m', symbol: 'mass', unit: 'grams (g)', defaultValue: 58.44 },
      { name: 'Molar Mass (MW)', symbol: 'mw', unit: 'g/mol (e.g. NaCl=58.44)', defaultValue: 58.44 },
      { name: 'Solution Volume', symbol: 'vol', unit: 'Liters (L)', defaultValue: 0.5 },
    ],
    calculate: (v) => {
      const moles = v.mass / v.mw;
      const molarity = moles / v.vol;
      return {
        result: molarity,
        unit: 'M (mol/L)',
        steps: `Moles = ${v.mass} g / ${v.mw} g/mol = ${moles.toFixed(3)} mol. Molarity = ${moles.toFixed(3)} mol / ${v.vol} L = ${molarity.toFixed(3)} M`,
      };
    },
  },
  {
    id: 'chem-ph',
    name: 'pH, pOH & Hydronium Concentration',
    subject: 'chemistry',
    subjectLabel: 'Chemistry',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Acids & Bases',
    formulaLatex: 'pH = -log₁₀[H⁺], pOH = 14 - pH',
    description: 'Logarithmic measure of acidity or basicity from aqueous hydrogen ion concentration [H⁺].',
    variables: [
      { name: 'Hydrogen ion [H⁺]', symbol: 'h', unit: 'mol/L', defaultValue: 1e-7, step: 1e-8 },
    ],
    calculate: (v) => {
      if (v.h <= 0) return { result: 7, unit: 'Invalid [H⁺]', steps: '[H⁺] must be positive.' };
      const ph = -Math.log10(v.h);
      const poh = 14 - ph;
      const classification = ph < 6.8 ? 'Acidic' : ph > 7.2 ? 'Basic / Alkaline' : 'Neutral';
      return {
        result: ph,
        unit: `pH (${classification}, pOH = ${poh.toFixed(2)})`,
        steps: `pH = -log₁₀(${v.h.toExponential(2)}) = ${ph.toFixed(2)}. pOH = 14 - ${ph.toFixed(2)} = ${poh.toFixed(2)}. Classification: ${classification}.`,
      };
    },
  },
  {
    id: 'chem-henderson',
    name: 'Henderson-Hasselbalch Buffer pH',
    subject: 'chemistry',
    subjectLabel: 'Chemistry',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Acids & Bases',
    formulaLatex: 'pH = pKa + log₁₀([A⁻] / [HA])',
    description: 'Calculates the pH of a conjugate acid-base buffer solution given weak acid pKa and molar ratio.',
    variables: [
      { name: 'Acid pKa', symbol: 'pka', unit: '(e.g. Acetic=4.76)', defaultValue: 4.76, step: 0.1 },
      { name: 'Conjugate Base [A⁻]', symbol: 'base', unit: 'M', defaultValue: 0.15, step: 0.01 },
      { name: 'Weak Acid [HA]', symbol: 'acid', unit: 'M', defaultValue: 0.1, step: 0.01 },
    ],
    calculate: (v) => {
      const ratio = v.base / v.acid;
      const ph = v.pka + Math.log10(ratio);
      return {
        result: ph,
        unit: 'pH',
        steps: `[A⁻]/[HA] = ${v.base}/${v.acid} = ${ratio.toFixed(3)}. log₁₀(${ratio.toFixed(3)}) = ${Math.log10(ratio).toFixed(3)}. pH = ${v.pka} + ${Math.log10(ratio).toFixed(3)} = ${ph.toFixed(3)}`,
      };
    },
  },
  {
    id: 'chem-gibbs',
    name: 'Gibbs Free Energy & Spontaneity',
    subject: 'chemistry',
    subjectLabel: 'Chemistry',
    grade: 'college',
    gradeLabel: 'College & University',
    topic: 'Thermochemistry',
    formulaLatex: 'ΔG = ΔH - T × ΔS',
    description: 'Determines thermodynamic spontaneity (ΔG < 0 is spontaneous) from enthalpy and entropy changes.',
    variables: [
      { name: 'Enthalpy ΔH', symbol: 'dh', unit: 'kJ/mol', defaultValue: -50 },
      { name: 'Temperature T', symbol: 't', unit: 'Kelvin (K)', defaultValue: 298 },
      { name: 'Entropy ΔS', symbol: 'ds', unit: 'J/(mol·K)', defaultValue: -80 },
    ],
    calculate: (v) => {
      const dg = v.dh - (v.t * v.ds) / 1000;
      const spontaneous = dg < 0 ? 'Spontaneous (Exergonic)' : dg > 0 ? 'Non-Spontaneous (Endergonic)' : 'At Equilibrium';
      return {
        result: dg,
        unit: `kJ/mol (${spontaneous})`,
        steps: `T × ΔS = ${v.t} K × (${v.ds}/1000 kJ/K) = ${((v.t * v.ds) / 1000).toFixed(2)} kJ. ΔG = ${v.dh} - (${((v.t * v.ds) / 1000).toFixed(2)}) = ${dg.toFixed(2)} kJ/mol. ${spontaneous}.`,
      };
    },
  },
  {
    id: 'chem-beer-lambert',
    name: 'Beer-Lambert Law of Absorbance',
    subject: 'chemistry',
    subjectLabel: 'Chemistry',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Spectrophotometry',
    formulaLatex: 'A = ε × b × c',
    description: 'Relates light absorbance A to molar absorptivity ε, cuvette path length b, and concentration c.',
    variables: [
      { name: 'Molar absorptivity ε', symbol: 'eps', unit: 'L/(mol·cm)', defaultValue: 8400 },
      { name: 'Path length b', symbol: 'b', unit: 'cm', defaultValue: 1.0, step: 0.1 },
      { name: 'Concentration c', symbol: 'c', unit: 'mol/L (M)', defaultValue: 0.00005, step: 0.00001 },
    ],
    calculate: (v) => {
      const a = v.eps * v.b * v.c;
      const percentTransmittance = Math.pow(10, -a) * 100;
      return {
        result: a,
        unit: `Absorbance (${percentTransmittance.toFixed(1)}% Transmittance)`,
        steps: `A = ${v.eps} × ${v.b} cm × ${v.c} M = ${a.toFixed(3)}. Light transmitted = 10^(-${a.toFixed(3)}) × 100% = ${percentTransmittance.toFixed(1)}%`,
      };
    },
  },

  // ==========================================
  // --- 4. BIOLOGY & GENETICS ---
  // ==========================================
  {
    id: 'bio-hardy',
    name: 'Hardy-Weinberg Genetic Equilibrium',
    subject: 'biology',
    subjectLabel: 'Biology',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Population Genetics',
    formulaLatex: 'p² + 2pq + q² = 1, where p + q = 1',
    description: 'Calculates expected genotype frequencies (Homozygous Dominant, Heterozygous, Recessive) under equilibrium.',
    variables: [
      { name: 'Recessive allele frequency q', symbol: 'q', unit: '', defaultValue: 0.3, step: 0.05 },
    ],
    calculate: (v) => {
      const q = Math.max(0, Math.min(1, v.q));
      const p = 1 - q;
      const p2 = p * p;
      const twoPq = 2 * p * q;
      const q2 = q * q;
      return {
        result: p2,
        unit: `p²=${(p2 * 100).toFixed(1)}%, 2pq=${(twoPq * 100).toFixed(1)}%, q²=${(q2 * 100).toFixed(1)}%`,
        steps: `p = (1 - q) = ${p.toFixed(2)}. Homozygous dominant AA (p²) = ${(p2 * 100).toFixed(1)}%. Heterozygous Aa (2pq) = ${(twoPq * 100).toFixed(1)}%. Homozygous recessive aa (q²) = ${(q2 * 100).toFixed(1)}%.`,
      };
    },
  },
  {
    id: 'bio-doubling',
    name: 'Exponential Doubling Time (Rule of 70)',
    subject: 'biology',
    subjectLabel: 'Biology',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Population Biology',
    formulaLatex: 't_d = ln(2) / r ≈ 70 / r%',
    description: 'Time required for a bacterial culture or biological population to double in size at growth rate r.',
    variables: [
      { name: 'Growth Rate r (% per period)', symbol: 'r', unit: '%', defaultValue: 3.5, step: 0.5 },
    ],
    calculate: (v) => {
      if (v.r <= 0) return { result: 0, unit: 'No Doubling (r ≤ 0)', steps: 'Growth rate must be positive for expansion.' };
      const exactTime = Math.log(2) / (v.r / 100);
      const ruleOf70 = 70 / v.r;
      return {
        result: exactTime,
        unit: 'time periods',
        steps: `Exact: ln(2) / ${(v.r / 100).toFixed(4)} = ${exactTime.toFixed(2)} periods. Quick Rule of 70 estimate: 70 / ${v.r}% = ${ruleOf70.toFixed(2)} periods.`,
      };
    },
  },
  {
    id: 'bio-surface-vol',
    name: 'Cell Surface Area-to-Volume Ratio',
    subject: 'biology',
    subjectLabel: 'Biology',
    grade: 'middle',
    gradeLabel: 'Middle School (Grades 6-8)',
    topic: 'Cell Biology',
    formulaLatex: 'SA/V = (4πr²) / ((4/3)πr³) = 3 / r',
    description: 'Explains why biological cells remain microscopic: diffusion efficiency requires high surface area relative to volume.',
    variables: [
      { name: 'Cell Radius r', symbol: 'r', unit: 'μm (micrometers)', defaultValue: 10, step: 2 },
    ],
    calculate: (v) => {
      const sa = 4 * Math.PI * v.r * v.r;
      const vol = (4 / 3) * Math.PI * Math.pow(v.r, 3);
      const ratio = 3 / v.r;
      return {
        result: ratio,
        unit: 'μm⁻¹ (Surface/Volume)',
        steps: `SA = ${sa.toFixed(1)} μm². Volume = ${vol.toFixed(1)} μm³. Ratio = 3 / ${v.r} = ${ratio.toFixed(3)} μm⁻¹. ${v.r > 25 ? 'Low diffusion efficiency (cell must divide)' : 'High diffusion efficiency'}.`,
      };
    },
  },
  {
    id: 'bio-michaelis-menten',
    name: 'Michaelis-Menten Enzyme Kinetics',
    subject: 'biology',
    subjectLabel: 'Biology',
    grade: 'college',
    gradeLabel: 'College & University',
    topic: 'Biochemistry',
    formulaLatex: 'v₀ = (V_max × [S]) / (K_m + [S])',
    description: 'Initial catalytic velocity v₀ of an enzyme-catalyzed reaction as a function of substrate concentration [S].',
    variables: [
      { name: 'Max Velocity V_max', symbol: 'vmax', unit: 'μmol/(min·mg)', defaultValue: 120 },
      { name: 'Michaelis Constant K_m', symbol: 'km', unit: 'mM', defaultValue: 4.5, step: 0.5 },
      { name: 'Substrate Concentration [S]', symbol: 's', unit: 'mM', defaultValue: 9.0, step: 1 },
    ],
    calculate: (v) => {
      const v0 = (v.vmax * v.s) / (v.km + v.s);
      const percentMax = (v0 / v.vmax) * 100;
      return {
        result: v0,
        unit: `μmol/(min·mg) (${percentMax.toFixed(1)}% of V_max)`,
        steps: `v₀ = (${v.vmax} × ${v.s}) / (${v.km} + ${v.s}) = ${(v.vmax * v.s).toFixed(1)} / ${(v.km + v.s).toFixed(1)} = ${v0.toFixed(2)} μmol/(min·mg)`,
      };
    },
  },

  // ==========================================
  // --- 5. ECONOMICS & BUSINESS ---
  // ==========================================
  {
    id: 'econ-compound',
    name: 'Compound Interest & Future Value',
    subject: 'economics',
    subjectLabel: 'Economics & Finance',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Financial Mathematics',
    formulaLatex: 'A = P × (1 + r/n)^(n×t)',
    description: 'Calculates accumulated principal plus interest compounded n times per year.',
    variables: [
      { name: 'Principal Investment P', symbol: 'p', unit: '$', defaultValue: 10000, step: 500 },
      { name: 'Annual Rate r', symbol: 'r', unit: '%', defaultValue: 7.5, step: 0.25 },
      { name: 'Compounding frequency n/yr', symbol: 'n', unit: '/yr', defaultValue: 12 },
      { name: 'Horizon t', symbol: 't', unit: 'years', defaultValue: 10 },
    ],
    calculate: (v) => {
      const rDec = v.r / 100;
      const a = v.p * Math.pow(1 + rDec / v.n, v.n * v.t);
      const interest = a - v.p;
      return {
        result: a,
        unit: `$${a.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        steps: `A = $${v.p.toLocaleString()} × (1 + ${(rDec / v.n).toFixed(5)})^(${v.n * v.t}) = $${a.toFixed(2)}. Total Interest Earned = $${interest.toFixed(2)}`,
      };
    },
  },
  {
    id: 'econ-amortization',
    name: 'Loan Monthly Payment (Amortization PMT)',
    subject: 'economics',
    subjectLabel: 'Economics & Finance',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Financial Mathematics',
    formulaLatex: 'PMT = P × [r(1+r)^n] / [(1+r)^n - 1]',
    description: 'Exact fixed monthly installment required to fully amortize a loan of principal P at annual rate r.',
    variables: [
      { name: 'Loan Principal P', symbol: 'p', unit: '$', defaultValue: 300000, step: 5000 },
      { name: 'Annual Interest Rate', symbol: 'rate', unit: '%', defaultValue: 6.5, step: 0.125 },
      { name: 'Loan Term', symbol: 'term', unit: 'years', defaultValue: 30 },
    ],
    calculate: (v) => {
      const monthlyRate = v.rate / 100 / 12;
      const totalPayments = v.term * 12;
      const factor = Math.pow(1 + monthlyRate, totalPayments);
      const pmt = (v.p * (monthlyRate * factor)) / (factor - 1);
      const totalPaid = pmt * totalPayments;
      const totalInterest = totalPaid - v.p;
      return {
        result: pmt,
        unit: `$${pmt.toFixed(2)} / month`,
        steps: `Monthly Rate = ${(monthlyRate * 100).toFixed(4)}%. Total Months = ${totalPayments}. Payment = $${pmt.toFixed(2)}/mo. Total Repaid = $${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })} ($${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })} interest).`,
      };
    },
  },
  {
    id: 'econ-breakeven',
    name: 'Break-Even Production Volume',
    subject: 'economics',
    subjectLabel: 'Economics & Finance',
    grade: 'college',
    gradeLabel: 'College & University',
    topic: 'Microeconomics',
    formulaLatex: 'Q = Fixed Costs / (Price - Unit Variable Cost)',
    description: 'Minimum units sold required to cover total operational and fixed expenses with zero net profit/loss.',
    variables: [
      { name: 'Fixed Overhead Costs (FC)', symbol: 'fc', unit: '$', defaultValue: 50000, step: 1000 },
      { name: 'Selling Price per Unit (P)', symbol: 'p', unit: '$', defaultValue: 120, step: 5 },
      { name: 'Variable Cost per Unit (VC)', symbol: 'vc', unit: '$', defaultValue: 45, step: 5 },
    ],
    calculate: (v) => {
      const margin = v.p - v.vc;
      if (margin <= 0) {
        return { result: 0, unit: 'Infeasible (Price ≤ VC)', steps: 'Unit contribution margin is negative; product loses money on every sale.' };
      }
      const q = Math.ceil(v.fc / margin);
      const revenueAtBreakeven = q * v.p;
      return {
        result: q,
        unit: `${q.toLocaleString()} units ($${revenueAtBreakeven.toLocaleString()} revenue)`,
        steps: `Contribution Margin = $${v.p} - $${v.vc} = $${margin}/unit. Q = $${v.fc.toLocaleString()} / $${margin} = ${q.toLocaleString()} units.`,
      };
    },
  },
  {
    id: 'econ-elasticity',
    name: 'Price Elasticity of Demand (PED)',
    subject: 'economics',
    subjectLabel: 'Economics & Finance',
    grade: 'college',
    gradeLabel: 'College & University',
    topic: 'Microeconomics',
    formulaLatex: 'PED = (%Δ Quantity Demanded) / (%Δ Price)',
    description: 'Measures consumer responsiveness of quantity demanded following a change in price.',
    variables: [
      { name: '% Change in Quantity Demanded', symbol: 'dq', unit: '%', defaultValue: -15, step: 1 },
      { name: '% Change in Price', symbol: 'dp', unit: '%', defaultValue: 10, step: 1 },
    ],
    calculate: (v) => {
      if (v.dp === 0) return { result: 0, unit: 'Undefined (%ΔP = 0)', steps: 'Price change must be non-zero.' };
      const ped = v.dq / v.dp;
      const absPed = Math.abs(ped);
      const elasticity = absPed > 1 ? 'Elastic (|PED| > 1)' : absPed < 1 ? 'Inelastic (|PED| < 1)' : 'Unit Elastic (|PED| = 1)';
      return {
        result: ped,
        unit: `${ped.toFixed(2)} (${elasticity})`,
        steps: `PED = (${v.dq}%) / (${v.dp}%) = ${ped.toFixed(2)}. Consumer demand is ${elasticity}.`,
      };
    },
  },

  // ==========================================
  // --- 6. COMPUTER SCIENCE & ENGINEERING ---
  // ==========================================
  {
    id: 'cs-shannon-entropy',
    name: 'Shannon Information Entropy',
    subject: 'cs',
    subjectLabel: 'Computer Science',
    grade: 'college',
    gradeLabel: 'College & University',
    topic: 'Information Theory',
    formulaLatex: 'H = - [p × log₂(p) + (1-p) × log₂(1-p)]',
    description: 'Average rate of information produced by a stochastic binary communication source in bits per symbol.',
    variables: [
      { name: 'Probability of 1 (p)', symbol: 'p', unit: '', defaultValue: 0.5, step: 0.05 },
    ],
    calculate: (v) => {
      const p = Math.max(0.0001, Math.min(0.9999, v.p));
      const q = 1 - p;
      const h = -(p * Math.log2(p) + q * Math.log2(q));
      return {
        result: h,
        unit: 'bits / symbol',
        steps: `p = ${p.toFixed(2)}, 1-p = ${q.toFixed(2)}. H = -(${p.toFixed(2)}×${Math.log2(p).toFixed(2)} + ${q.toFixed(2)}×${Math.log2(q).toFixed(2)}) = ${h.toFixed(4)} bits/symbol (${p === 0.5 ? 'Maximum entropy / full randomness' : 'Reduced entropy / predictable'}).`,
      };
    },
  },
  {
    id: 'cs-transfer-time',
    name: 'Network Transfer Time & Bandwidth',
    subject: 'cs',
    subjectLabel: 'Computer Science',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Computer Networks',
    formulaLatex: 'Time = (File Size in Bits) / (Bandwidth in bps)',
    description: 'Exact duration required to transfer a file across a network pipe of given bandwidth speed.',
    variables: [
      { name: 'File Size', symbol: 'size', unit: 'Gigabytes (GB)', defaultValue: 15, step: 1 },
      { name: 'Internet Bandwidth', symbol: 'speed', unit: 'Mbps', defaultValue: 100, step: 25 },
    ],
    calculate: (v) => {
      const totalBits = v.size * 8 * 1024; // Mbits
      const seconds = totalBits / v.speed;
      const minutes = seconds / 60;
      return {
        result: minutes,
        unit: `minutes (${seconds.toFixed(0)} seconds)`,
        steps: `${v.size} GB = ${(v.size * 8).toFixed(1)} Gb = ${totalBits.toLocaleString()} Megabits. Time = ${totalBits.toLocaleString()} / ${v.speed} Mbps = ${seconds.toFixed(0)} seconds (${minutes.toFixed(1)} mins).`,
      };
    },
  },
  {
    id: 'cs-parallel-resistors',
    name: 'Parallel Resistors & Conductance',
    subject: 'cs',
    subjectLabel: 'Computer Science & Engineering',
    grade: 'middle',
    gradeLabel: 'Middle School (Grades 6-8)',
    topic: 'Digital Hardware',
    formulaLatex: '1/R_eq = 1/R₁ + 1/R₂ → R_eq = (R₁ × R₂) / (R₁ + R₂)',
    description: 'Calculates equivalent resistance of two electrical resistors wired in parallel.',
    variables: [
      { name: 'Resistor R₁', symbol: 'r1', unit: 'Ohms (Ω)', defaultValue: 100, step: 10 },
      { name: 'Resistor R₂', symbol: 'r2', unit: 'Ohms (Ω)', defaultValue: 100, step: 10 },
    ],
    calculate: (v) => {
      const req = (v.r1 * v.r2) / (v.r1 + v.r2);
      return {
        result: req,
        unit: 'Ohms (Ω)',
        steps: `R_eq = (${v.r1} × ${v.r2}) / (${v.r1} + ${v.r2}) = ${v.r1 * v.r2} / ${v.r1 + v.r2} = ${req.toFixed(2)} Ω (Parallel resistance is always strictly less than smallest resistor).`,
      };
    },
  },
  {
    id: 'cs-rc-time',
    name: 'RC Circuit Time Constant (τ)',
    subject: 'cs',
    subjectLabel: 'Computer Science & Engineering',
    grade: 'senior',
    gradeLabel: 'Senior High & AP (Grades 11-12)',
    topic: 'Electrical Engineering',
    formulaLatex: 'τ = R × C',
    description: 'Time constant required to charge an electrical capacitor to 63.2% of supply voltage.',
    variables: [
      { name: 'Resistance R', symbol: 'r', unit: 'kilo-Ohms (kΩ)', defaultValue: 10, step: 1 },
      { name: 'Capacitance C', symbol: 'c', unit: 'micro-Farads (μF)', defaultValue: 47, step: 5 },
    ],
    calculate: (v) => {
      const tau = (v.r * 1000) * (v.c * 1e-6);
      const fullCharge = tau * 5;
      return {
        result: tau,
        unit: `seconds (${(tau * 1000).toFixed(1)} ms)`,
        steps: `τ = ${v.r * 1000} Ω × ${v.c * 1e-6} F = ${tau.toFixed(4)} s. 5τ (99.3% fully charged) = ${(fullCharge * 1000).toFixed(1)} ms.`,
      };
    },
  },

  // ==========================================
  // --- 7. EARTH & ENVIRONMENTAL SCIENCES ---
  // ==========================================
  {
    id: 'earth-richter',
    name: 'Earthquake Magnitude Energy Ratio',
    subject: 'earth',
    subjectLabel: 'Earth & Environmental Sciences',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Seismology',
    formulaLatex: 'E₂ / E₁ = 10^(1.5 × (M₂ - M₁)) ≈ 31.6^(M₂ - M₁)',
    description: 'Compares total seismic energy released between two earthquakes of Richter magnitudes M₁ and M₂.',
    variables: [
      { name: 'Larger Magnitude M₂', symbol: 'm2', unit: '', defaultValue: 7.2, step: 0.1 },
      { name: 'Baseline Magnitude M₁', symbol: 'm1', unit: '', defaultValue: 5.2, step: 0.1 },
    ],
    calculate: (v) => {
      const diff = v.m2 - v.m1;
      const ratio = Math.pow(10, 1.5 * diff);
      return {
        result: ratio,
        unit: '× times more energy',
        steps: `ΔM = ${v.m2} - ${v.m1} = ${diff.toFixed(1)}. Energy ratio = 10^(1.5 × ${diff.toFixed(1)}) = 10^(${(1.5 * diff).toFixed(2)}) = ${ratio.toLocaleString(undefined, { maximumFractionDigits: 1 })}× more energy!`,
      };
    },
  },
  {
    id: 'earth-dewpoint',
    name: 'Dew Point Temperature (Magnus Formula)',
    subject: 'earth',
    subjectLabel: 'Earth & Environmental Sciences',
    grade: 'high',
    gradeLabel: 'High School (Grades 9-10)',
    topic: 'Meteorology',
    formulaLatex: 'T_dp = (b × α) / (a - α), where α = (a×T)/(b+T) + ln(RH/100)',
    description: 'Temperature to which air must be cooled at constant pressure to reach 100% saturation (fog/dew condensation).',
    variables: [
      { name: 'Air Temperature T', symbol: 't', unit: '°C', defaultValue: 25, step: 1 },
      { name: 'Relative Humidity RH', symbol: 'rh', unit: '%', defaultValue: 60, step: 5 },
    ],
    calculate: (v) => {
      const a = 17.27;
      const b = 237.7;
      const alpha = (a * v.t) / (b + v.t) + Math.log(v.rh / 100);
      const tdp = (b * alpha) / (a - alpha);
      return {
        result: tdp,
        unit: '°C',
        steps: `α = (${a}×${v.t})/(${b}+${v.t}) + ln(${v.rh}/100) = ${alpha.toFixed(4)}. Dew point T_dp = (${b} × ${alpha.toFixed(4)}) / (${a} - ${alpha.toFixed(4)}) = ${tdp.toFixed(1)} °C.`,
      };
    },
  },
  {
    id: 'earth-carbon-offset',
    name: 'Carbon Emissions & Tree Absorption Equivalence',
    subject: 'earth',
    subjectLabel: 'Earth & Environmental Sciences',
    grade: 'middle',
    gradeLabel: 'Middle School (Grades 6-8)',
    topic: 'Ecology & Climate',
    formulaLatex: 'Trees Needed = (Annual CO₂ kg) / 22 kg CO₂ per mature tree/year',
    description: 'Calculates the number of mature urban trees required to sequester personal or organizational carbon emissions.',
    variables: [
      { name: 'Annual Carbon Footprint', symbol: 'co2', unit: 'kg CO₂ / year', defaultValue: 4500, step: 250 },
    ],
    calculate: (v) => {
      const trees = Math.ceil(v.co2 / 22);
      return {
        result: trees,
        unit: 'mature trees required',
        steps: `Average mature tree absorbs ~22 kg CO₂/yr. ${v.co2.toLocaleString()} kg CO₂ / 22 kg = ${trees} trees needed to offset annually.`,
      };
    },
  },
];

const SUBJECT_CATEGORIES: { id: SubjectId; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Subjects', icon: Layers },
  { id: 'math', label: 'Mathematics', icon: Calculator },
  { id: 'physics', label: 'Physics', icon: Atom },
  { id: 'chemistry', label: 'Chemistry', icon: Sparkles },
  { id: 'biology', label: 'Biology & Genetics', icon: Dna },
  { id: 'economics', label: 'Economics & Finance', icon: TrendingUp },
  { id: 'cs', label: 'Computer Science', icon: Cpu },
  { id: 'earth', label: 'Earth & Climate', icon: Globe2 },
];

const GRADE_LEVELS: { id: GradeLevel; label: string }[] = [
  { id: 'all', label: 'All Grades' },
  { id: 'middle', label: 'Middle School (Grades 6-8)' },
  { id: 'high', label: 'High School (Grades 9-10)' },
  { id: 'senior', label: 'Senior High & AP (Grades 11-12)' },
  { id: 'college', label: 'College & Engineering' },
];

export const SubjectFormulasView: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFormulaId, setActiveFormulaId] = useState<string>(FORMULA_DATABASE[0].id);
  const [paramValues, setParamValues] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFormula = useMemo(() => {
    return FORMULA_DATABASE.find(f => f.id === activeFormulaId) || FORMULA_DATABASE[0];
  }, [activeFormulaId]);

  // Sync default variable values when active formula changes
  const currentParams = useMemo(() => {
    const values: Record<string, number> = {};
    activeFormula.variables.forEach(v => {
      values[v.symbol] = paramValues[v.symbol] !== undefined ? paramValues[v.symbol] : v.defaultValue;
    });
    return values;
  }, [activeFormula, paramValues]);

  const calculationResult = useMemo(() => {
    try {
      return activeFormula.calculate(currentParams);
    } catch {
      return { result: 0, unit: 'Error', steps: 'Please check your input values.' };
    }
  }, [activeFormula, currentParams]);

  const handleParamChange = (symbol: string, val: number) => {
    setParamValues(prev => ({
      ...prev,
      [symbol]: isNaN(val) ? 0 : val,
    }));
  };

  const handleResetDefaults = () => {
    sounds.playClick();
    const defaults: Record<string, number> = {};
    activeFormula.variables.forEach(v => {
      defaults[v.symbol] = v.defaultValue;
    });
    setParamValues(defaults);
  };

  const handleCopyResult = () => {
    sounds.playSuccess();
    const text = `${activeFormula.name}\nFormula: ${activeFormula.formulaLatex}\nInputs: ${JSON.stringify(currentParams)}\nResult: ${calculationResult.unit}\nSteps: ${calculationResult.steps}`;
    navigator.clipboard.writeText(text);
    setCopiedId(activeFormula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    return FORMULA_DATABASE.filter(f => {
      const matchSubject = selectedSubject === 'all' || f.subject === selectedSubject;
      const matchGrade = selectedGrade === 'all' || f.grade === selectedGrade;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.topic.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.formulaLatex.toLowerCase().includes(q);
      return matchSubject && matchGrade && matchQuery;
    });
  }, [selectedSubject, selectedGrade, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <span>Academic Knowledge Engine</span>
          <span aria-hidden="true">·</span>
          <span>{FORMULA_DATABASE.length} Interactive Solvers</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Subject Formulas & Scientific Solver
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Comprehensive formula reference across 7 core academic disciplines. Plug in custom values to get instant answers with detailed step-by-step mathematical derivations.
        </p>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80 scrollbar-none">
        {SUBJECT_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedSubject === cat.id;
          const count = cat.id === 'all' ? FORMULA_DATABASE.length : FORMULA_DATABASE.filter(f => f.subject === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedSubject(cat.id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono opacity-80 ${isSelected ? 'text-zinc-200 dark:text-zinc-800' : 'text-zinc-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grade Selector & Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-medium text-zinc-400 shrink-0">Grade:</span>
          {GRADE_LEVELS.map(g => (
            <button
              key={g.id}
              onClick={() => {
                sounds.playClick();
                setSelectedGrade(g.id);
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedGrade === g.id
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search formulas, variables..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Formulas List */}
        <div className="lg:col-span-5 space-y-2 max-h-[720px] overflow-y-auto pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between px-1">
            <span>Formulas ({filteredFormulas.length})</span>
            <span>Click to Solve</span>
          </div>

          {filteredFormulas.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-500">
              No formulas found matching your filter criteria.
            </div>
          ) : (
            filteredFormulas.map(formula => {
              const isSelected = formula.id === activeFormulaId;
              return (
                <button
                  key={formula.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveFormulaId(formula.id);
                    setParamValues({});
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/30 shadow-xs'
                      : 'border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {formula.name}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 shrink-0 font-semibold">
                      {formula.topic}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300 mt-1 bg-zinc-100/70 dark:bg-zinc-800/70 px-2 py-0.5 rounded truncate">
                    {formula.formulaLatex}
                  </div>

                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                    {formula.description}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Interactive Solver Workbench */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
          {/* Active Formula Header */}
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  {activeFormula.subjectLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeFormula.topic}</span>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-500">{activeFormula.gradeLabel}</span>
              </div>
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {activeFormula.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Reset to sample values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleCopyResult}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                  copiedId === activeFormula.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                }`}
                title="Copy complete solution to clipboard"
              >
                {copiedId === activeFormula.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Solution</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Formula Display Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Governing Equation</span>
            <div className="text-base sm:text-lg font-mono font-bold text-indigo-700 dark:text-indigo-300 py-1">
              {activeFormula.formulaLatex}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              {activeFormula.description}
            </p>
          </div>

          {/* Parameter Inputs */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Input Parameters ({activeFormula.variables.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeFormula.variables.map(v => (
                <div key={v.symbol} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {v.name}
                    </span>
                    <span className="font-mono text-zinc-400">
                      [{v.symbol}]{v.unit ? ` (${v.unit})` : ''}
                    </span>
                  </div>
                  <input
                    type="number"
                    step={v.step || 'any'}
                    value={currentParams[v.symbol] !== undefined ? currentParams[v.symbol] : v.defaultValue}
                    onChange={e => handleParamChange(v.symbol, parseFloat(e.target.value))}
                    className="w-full p-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Solution & Derivation Result Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Calculated Solution
              </span>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-300">
                Live Precision
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-indigo-950 dark:text-indigo-100 font-mono">
              {calculationResult.unit.includes('=') ? calculationResult.unit : `${calculationResult.result.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${calculationResult.unit}`}
            </div>

            <div className="border-t border-indigo-200/60 dark:border-indigo-900/60 pt-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed bg-white/60 dark:bg-zinc-900/60 p-3 rounded-xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Step-by-Step Derivation:</div>
              {calculationResult.steps}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
