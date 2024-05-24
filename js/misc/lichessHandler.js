export class LichessHandler {
    constructor(api_key) {
        this.headers = {
            Authorization: 'Bearer ' + api_key,
        };
    }

    async getStudy(url) {
        const studyIdOptions = this.getStudyIdOptions(url);
        for (const studyId of studyIdOptions) {
            try {
                const response = await fetch(`https://lichess.org/api/study/${studyId}.pgn`, {
                    method: 'GET',
                    headers: this.headers,
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const fileContent = await response.text();
                return fileContent; // Return the content if successful
            } catch (error) {
                console.error(`Failed to fetch study with ID: ${studyId}`, error);
            }
        }
        throw new Error('Failed to fetch study with both ID options');
    }

    getStudyIdOptions(url) {
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        const secondLastPart = parts[parts.length - 2];
        return [lastPart, secondLastPart];
    }
}

