import { h } from 'preact';
import { useState } from 'preact/hooks';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**
 * Configuration options for a quiz game session.
 */
export type GameOptions = {
  /** Number of questions in the quiz (3-30) */
  amount: number;
  /** Category ID (0 = any category, or specific category from API) */
  category: number;
  /** Difficulty level or 'any' for mixed difficulties */
  difficulty: 'easy' | 'medium' | 'hard' | 'any';
  /** Question type filter or 'any' for both types */
  type: 'boolean' | 'multiple' | 'any';
};

/**
 * Props for the OptionsPanel component.
 */
type Props = {
  /** Callback invoked when any option changes with new complete options object */
  onOptionsChange: (options: GameOptions) => void;
  /** Callback invoked when user clicks the Restart Game button */
  onRestart: () => void;
};

/**
 * OptionsPanel provides a form interface for configuring quiz game settings.
 *
 * The panel includes controls for:
 * - Number of questions (3-30 via slider)
 * - Category selection (25+ categories from Open Trivia Database)
 * - Difficulty level (easy, medium, hard, or any)
 * - Question types (true/false, multiple choice, or both)
 *
 * Features:
 * - Real-time option updates via onOptionsChange callback
 * - Type checkboxes can be combined: both unchecked = any type
 * - Restart button to apply changes and start a new game
 * - Themed UI adapting to light/dark modes
 *
 * Question Type Logic:
 * - Both checkboxes checked → type: 'any'
 * - Only True/False checked → type: 'boolean'
 * - Only Multiple Choice checked → type: 'multiple'
 * - Neither checked → type: 'any'
 *
 * @param props - Component props
 * @param props.onOptionsChange - Function called with updated options on every change
 * @param props.onRestart - Function called when Restart Game button is clicked
 *
 * @example
 * ```tsx
 * <OptionsPanel
 *   onOptionsChange={(opts) => setPendingOptions(opts)}
 *   onRestart={() => startNewGame()}
 * />
 * ```
 */
export function OptionsPanel({ onOptionsChange, onRestart }: Props) {
  /** Number of questions to fetch (3-30) */
  const [amount, setAmount] = useState(3);
  /** Selected category ID (0 = any) */
  const [category, setCategory] = useState(0);
  /** Selected difficulty level */
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'any'>('any');
  /** Whether True/False questions are enabled */
  const [typeBoolean, setTypeBoolean] = useState(false);
  /** Whether Multiple Choice questions are enabled */
  const [typeMultiple, setTypeMultiple] = useState(false);

  /**
   * Handles slider change for number of questions.
   * Updates local state and notifies parent of option change.
   *
   * @param _ - Unused event parameter
   * @param value - New slider value (number or array)
   */
  function handleAmountChange(_: any, value: number | number[]) {
    const newAmount = Array.isArray(value) ? value[0] : value;
    setAmount(newAmount);
    updateOptions({ amount: newAmount });
  }

  /**
   * Handles category dropdown selection change.
   *
   * @param e - Select change event
   */
  function handleCategoryChange(e: any) {
    const newCategory = parseInt(e.target.value, 10);
    setCategory(newCategory);
    updateOptions({ category: newCategory });
  }

  /**
   * Handles difficulty dropdown selection change.
   *
   * @param e - Select change event
   */
  function handleDifficultyChange(e: any) {
    const newDifficulty = e.target.value as 'easy' | 'medium' | 'hard' | 'any';
    setDifficulty(newDifficulty);
    updateOptions({ difficulty: newDifficulty });
  }

  /**
   * Toggles a question type checkbox.
   *
   * @param typeKey - Which type checkbox to toggle ('boolean' or 'multiple')
   */
  function handleTypeChange(typeKey: 'boolean' | 'multiple') {
    if (typeKey === 'boolean') {
      setTypeBoolean(!typeBoolean);
    } else {
      setTypeMultiple(!typeMultiple);
    }
  }

  /**
   * Determines the API type parameter based on checkbox states.
   *
   * @returns Type value for API request ('boolean', 'multiple', or 'any')
   */
  function getTypeValue(): 'boolean' | 'multiple' | 'any' {
    if (typeBoolean && typeMultiple) return 'any';
    if (typeBoolean) return 'boolean';
    if (typeMultiple) return 'multiple';
    return 'any';
  }

  /**
   * Constructs complete options object and notifies parent component.
   *
   * @param partial - Partial options object to merge with current state
   */
  function updateOptions(partial: Partial<GameOptions>) {
    const options: GameOptions = {
      amount,
      category,
      difficulty,
      type: getTypeValue(),
      ...partial,
    };
    onOptionsChange(options);
  }

  /**
   * Triggers game restart with current options.
   */
  function handleRestart() {
    onRestart();
  }

  /** Available quiz categories from Open Trivia Database API */
  const categoryOptions = [
    { id: 0, name: 'Any Category' },
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Entertainment: Books' },
    { id: 11, name: 'Entertainment: Film' },
    { id: 12, name: 'Entertainment: Music' },
    { id: 13, name: 'Entertainment: Musicals & Theatres' },
    { id: 14, name: 'Entertainment: Television' },
    { id: 15, name: 'Entertainment: Video Games' },
    { id: 16, name: 'Entertainment: Board Games' },
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Science: Computers' },
    { id: 19, name: 'Science: Mathematics' },
    { id: 20, name: 'Mythology' },
    { id: 21, name: 'Sports' },
    { id: 22, name: 'Geography' },
    { id: 23, name: 'History' },
    { id: 24, name: 'Politics' },
    { id: 25, name: 'Art' },
    { id: 26, name: 'Celebrities' },
    { id: 27, name: 'Animals' },
    { id: 28, name: 'Vehicles' },
    { id: 29, name: 'Entertainment: Comics' },
    { id: 30, name: 'Science: Gadgets' },
    { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
    { id: 32, name: 'Entertainment: Cartoon & Animations' },
  ];

  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text)' }}>
        Game Options
      </Typography>

      {/* Amount Slider */}
      <FormControl fullWidth>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--text)' }}>
          Number of Questions: {amount}
        </Typography>
        <Slider
          min={3}
          max={30}
          value={amount}
          onChange={handleAmountChange}
          marks={[
            { value: 3, label: '3' },
            { value: 30, label: '30' },
          ]}
          valueLabelDisplay="auto"
          sx={{
            color: 'var(--accent)',
            '& .MuiSlider-markLabel': {
              color: 'var(--text)',
            },
            '& .MuiSlider-valueLabelLabel': {
              color: 'var(--accent-text)',
            },
          }}
        />
      </FormControl>

      {/* Category Dropdown */}
      <FormControl fullWidth>
        <InputLabel sx={{ color: 'var(--text)' }}>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={handleCategoryChange}
          sx={{
            backgroundColor: 'var(--btn-bg)',
            color: 'var(--btn-text)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--btn-border)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--btn-border)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--accent)',
            },
          }}
        >
          {categoryOptions.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Difficulty Dropdown */}
      <FormControl fullWidth>
        <InputLabel sx={{ color: 'var(--text)' }}>Difficulty</InputLabel>
        <Select
          value={difficulty}
          label="Difficulty"
          onChange={handleDifficultyChange}
          sx={{
            backgroundColor: 'var(--btn-bg)',
            color: 'var(--btn-text)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--btn-border)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--btn-border)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--accent)',
            },
          }}
        >
          <MenuItem value="any">Any Difficulty</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>

      {/* Type Checkboxes */}
      <FormControl component="fieldset">
        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'var(--text)' }}>
          Question Type
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={typeBoolean}
                onChange={() => handleTypeChange('boolean')}
                sx={{
                  color: 'var(--text)',
                  '&.Mui-checked': {
                    color: 'var(--accent)',
                  },
                }}
              />
            }
            label={<span style={{ color: 'var(--text)' }}>True/False</span>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={typeMultiple}
                onChange={() => handleTypeChange('multiple')}
                sx={{
                  color: 'var(--text)',
                  '&.Mui-checked': {
                    color: 'var(--accent)',
                  },
                }}
              />
            }
            label={<span style={{ color: 'var(--text)' }}>Multiple Choice</span>}
          />
        </FormGroup>
      </FormControl>

      {/* Restart Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleRestart}
        sx={{
          backgroundColor: 'var(--accent)',
          color: 'var(--accent-text)',
          fontWeight: 700,
          py: 1.5,
          mt: 1,
          '&:hover': {
            backgroundColor: 'color-mix(in srgb, var(--accent) 85%, black 15%)',
          },
        }}
      >
        Restart Game
      </Button>
    </Stack>
  );
}