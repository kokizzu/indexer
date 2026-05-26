export function tabHelpText(tab) {
    const text = {
      suggest: 'Step 1 chooses suggest mode. Step 2 scans only directories that look fixable. Step 3 previews one row to inspect the cleaned naming and categorized target.',
      subtitles: 'Step 1 chooses subtitle mode. Step 2 scans one selected area for subtitle files that can be matched safely to a parent video stem. Step 3 queues one subtitle rename at a time.',
      rename: 'Step 1 chooses rename mode. Step 2 scans only rename candidates. Step 3 previews one row, then lets you adjust the final target path before queuing it.',
      move: 'Step 1 chooses move mode. Step 2 scans only folders already ready for sorted roots. Step 3 previews one row with its destination root and optional bucket.',
      delete: 'Step 1 chooses delete mode. Step 2 scans the selected area for removable targets. Step 3 previews one exact target, or selects multiple rows and queues them together.'
    }
    return text[tab] || ''
  }

export function previewMeta(tab) {
    const titles = {
      suggest: 'Step 3: Name Fix Preview / Queue',
      subtitles: 'Step 3: Subtitle Rename Queue',
      rename: 'Step 3: Rename Preview / Queue',
      move: 'Step 3: Sorted Move Preview / Queue',
      delete: 'Step 3: Delete Preview / Queue'
    }
    const placeholders = {
      suggest: 'Scan and preview a candidate above to inspect the categorize plan, grouped moves, and ambiguous subtitles.',
      subtitles: 'Scan subtitle rename candidates above, then queue one row at a time.',
      rename: 'Preview a rename candidate above or from the current browse path.',
      move: 'Preview a move-ready candidate above after choosing destination root and bucket.',
      delete: 'Preview one delete target above before queuing it.'
    }
    return {
      title: titles[tab] || 'Step 3: Preview / Queue',
      placeholder: placeholders[tab] || 'Fill the flow above, then click Preview.'
    }
  }

export function modeConfig(tab) {
    const configs = {
      suggest: {
        title: 'Step 2: Scan Suggest Candidates',
        button: 'Scan Suggest Candidates',
        empty: 'No suggestion candidates found in this scan path'
      },
      rename: {
        title: 'Step 2: Scan Rename Candidates',
        button: 'Scan Rename Candidates',
        empty: 'No rename candidates found in this scan path'
      },
      move: {
        title: 'Step 2: Scan Move-Ready Candidates',
        button: 'Scan Move-Ready Candidates',
        empty: 'No move-ready candidates found in this scan path'
      },
      delete: {
        title: 'Step 2: Scan Delete Targets',
        button: 'Scan Delete Targets',
        empty: 'No delete targets found in this scan path'
      }
    }
    return configs[tab] || configs.suggest
  }

export const IndexerManageUI = {
  tabHelpText,
  previewMeta,
  modeConfig,
};
