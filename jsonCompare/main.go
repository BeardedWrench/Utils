package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"sort"
	"time"
	"strings"
)

const maxDifferences = 20

type Difference struct {
	Line int
	Key  string
}

const (
	colorRed    = "\033[91m"
	colorGreen  = "\033[92m"
	colorBlue   = "\033[94m"
	colorReset  = "\033[0m"
)

func extractKeys(filename string) (map[string]int, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	keys := make(map[string]int)
	lineNum := 0
	keyRegex := regexp.MustCompile(`"([^"]+)":`)

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lineNum++
		line := scanner.Text()
		matches := keyRegex.FindStringSubmatch(line)
		if len(matches) > 1 {
			keys[matches[1]] = lineNum
		}
	}
	return keys, scanner.Err()
}

func findDifferences(keys1, keys2 map[string]int) (diffs []Difference) {
	for k, line := range keys1 {
		if _, found := keys2[k]; !found {
			diffs = append(diffs, Difference{Line: line, Key: k})
		}
	}
	return diffs
}

func colorPrint(format string, args []interface{}, color string) {
	// Choose the color based on the input
	var colorCode string
	switch color {
	case "green":
		colorCode = colorGreen
	case "red":
		colorCode = colorRed
	case "blue":
		colorCode = colorBlue
	default:
		colorCode = colorReset // Default to no color if an unrecognized color is specified
	}

	// Print the string in the chosen color
	fmt.Printf(colorCode+format+colorReset, args...)
}

func printDifferences(diffs []Difference, filename string) {
	if len(diffs) == 0 {
		colorPrint("No difference found in %s\n", []interface{}{filename}, "green")
		return
	}

	colorPrint("____________\n| %s |\n|---------------------|\n| line | difference   |\n|---------------------|\n", []interface{}{filename}, "red")

	for _, diff := range diffs {
		colorPrint("| %4d | %-13q \n|---------------------|\n", []interface{}{diff.Line, diff.Key}, "red")
	}

	fmt.Println()
}

func writeDifferencesToFile(file *os.File, diffs []Difference, filename string) {
	if len(diffs) == 0 {
		return
	}

	file.WriteString(fmt.Sprintf("____________\n| %s |\n|---------------------|\n| line | difference   |\n|---------------------|\n", filename))
	for _, diff := range diffs {
		file.WriteString(fmt.Sprintf("| %4d | %-13q \n|---------------------|\n", diff.Line, diff.Key))
	}
	file.WriteString("\n")
}

func main() {
	if len(os.Args) != 3 {
		colorPrint("Usage: go run main.go file1.json file2.json\n", nil, "red")
		return
	}

	file1, file2 := os.Args[1], os.Args[2]
	keys1, err1 := extractKeys(file1)
	keys2, err2 := extractKeys(file2)

	if err1 != nil || err2 != nil {
		colorPrint("Error reading files: %v, %v\n", []interface{}{err1, err2}, "red")
		return
	}

	diffs1 := findDifferences(keys1, keys2)
	diffs2 := findDifferences(keys2, keys1)

	sort.Slice(diffs1, func(i, j int) bool {
		return diffs1[i].Line < diffs1[j].Line
	})
	sort.Slice(diffs2, func(i, j int) bool {
		return diffs2[i].Line < diffs2[j].Line
	})

	if len(diffs1)+len(diffs2) > maxDifferences {
		timestamp := time.Now().Format("2006-01-02_15-04-05")
		baseFile1 := strings.TrimSuffix(file1, ".json")
		baseFile2 := strings.TrimSuffix(file2, ".json")
		filename := fmt.Sprintf("%s-%s-differences-%s.txt", baseFile1, baseFile2, timestamp)
		file, err := os.Create(filename)
		if err != nil {
			colorPrint("Error creating file: %s\n", []interface{}{err}, "red")
			return
		}
		defer file.Close()

		writeDifferencesToFile(file, diffs1, file1)
		writeDifferencesToFile(file, diffs2, file2)

		colorPrint("Differences found and exported to %s\n", []interface{}{filename}, "red")
	} else {
		printDifferences(diffs1, file1)
		printDifferences(diffs2, file2)
	}
}

