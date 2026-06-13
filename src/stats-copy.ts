/**
 * Tooltip copy for the statistics, adapted from providence/stats.py docstrings.
 * This is the layer that makes the rigor visible — keep it accurate to the
 * backend. Wording trimmed for a tooltip; the math is unchanged.
 */
export const STAT_COPY = {
  wilson:
    'Wilson score interval. A 95% confidence interval for the pass rate with ' +
    'better small-sample behavior than the normal approximation — it never ' +
    'escapes [0, 1]. The bar spans the interval; the dot is the observed rate.',

  clopperPearson:
    'Clopper–Pearson exact interval (strict mode). Guarantees ≥95% coverage at ' +
    'every sample size — what Wilson promises only on average — at the cost of ' +
    'a systematically wider interval.',

  threshold:
    'The pass-rate bar this suite must clear. The verdict is decided against ' +
    'this line by the confidence interval, not the point estimate alone.',

  verdictSettled:
    'Settled: even the confidence-interval bound on the correct side of the ' +
    'threshold clears it. The sample is large enough to call the verdict ' +
    'evidence, not a point guess.',

  verdictPoint:
    'NOT settled (point). The point estimate is on the passing/failing side, ' +
    'but the confidence interval straddles the threshold — too few items to ' +
    'call it. The sample-size certificate says how many more would settle it.',

  sampleSize:
    'Sample-size certificate. By exact binomial power at the observed rate, the ' +
    'smallest number of items at which this verdict would settle ~80% of the ' +
    'time. A planning number, not a guarantee — future items are assumed to ' +
    'behave like the observed ones.',

  fisher:
    'Fisher’s exact test for run-over-run drift. Exact at every sample size — ' +
    'including the n=4–8 suites real configs have, where a two-proportion ' +
    'z-test is anti-conservative. Conditions on both margins; no large-n ' +
    'approximation to fail at n=5.',

  holm:
    'Holm–Bonferroni adjustment. Testing many suites for drift at once inflates ' +
    'false positives — with 10 suites at α=.05, the unadjusted family-wise ' +
    'false-drift rate is ~40%. Holm caps it at 5% with no independence ' +
    'assumption. A suite is flagged only if its Holm-adjusted p < .05.',

  driftEvent:
    'Flagged drift: the pass rate changed enough that Fisher’s exact test, after ' +
    'Holm adjustment across all suites, rules it unlikely to be noise (p < .05).',

  notComparable:
    'Not comparable: the dataset, metric, or runs-per-item changed between ' +
    'versions, so a p-value here would be rigorous-looking nonsense. providence ' +
    'flags it instead of testing it.',
} as const

export type StatKey = keyof typeof STAT_COPY
