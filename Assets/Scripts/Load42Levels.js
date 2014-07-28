#pragma strict

var levelKey : String[];

function Awake ()
{
	levelKey = new String[21];
	
	levelKey[0] = null;
	levelKey[1] = "exo1#101,2,1/102,3,0/103,1,0/104,3,0/105,2,0/106,3,0/107,1,5/S2,F1,2,3,7,C107,3,A";
	levelKey[2] = "exo2#44,1,0/45,1,1/59,1,0/60,1,0/74,1,0/75,1,0/89,1,0/90,1,0/104,1,0/105,1,0/119,1,0/120,1,0/134,1,0/135,1,0/149,1,0/150,1,0/164,1,0/165,1,0/179,1,0/180,1,0/194,1,0/195,1,0/210,1,2/S5,F1,2,3,7,C210,0,A";
	levelKey[3] = "exo3#87,3,0/88,3,0/102,1,0/103,1,0/104,1,0/105,1,0/117,1,0/118,1,0/121,1,0/122,1,0/132,1,0/133,1,0/138,1,0/139,1,0/147,1,0/148,1,0/155,1,0/156,1,0/162,1,3/163,1,0/172,1,0/173,1,1/S5,F1,2,3,7,C162,1,A";
	levelKey[4] = "exo4#98,2,1/99,3,0/100,3,0/101,3,0/102,3,0/103,1,0/104,3,0/105,3,0/106,3,0/107,3,0/108,2,1/119,3,0/135,3,0/151,3,0/167,3,0/183,2,2/S6,F1,2,3,6,7,C183,0,A";
	levelKey[5] = "exo5#72,1,4/88,3,0/104,3,0/120,3,0/136,3,0/147,2,1/148,3,0/149,3,0/150,3,0/151,3,0/152,1,0/153,3,0/154,3,0/155,3,0/156,3,0/157,2,1/S3,4,F1,2,3,6,7,8,C72,2,A";
	levelKey[6] = "exo6#38,1,4/54,1,0/70,1,0/86,1,0/102,3,0/118,3,0/134,3,0/150,3,0/166,3,0/182,3,0/198,3,0/214,1,0/215,3,1/S3,3,F1,2,3,7,8,C38,2,A";
	levelKey[7] = "exo7#101,3,1/102,2,0/103,2,0/104,3,1/117,2,0/120,2,0/133,2,0/136,2,0/149,3,3/150,2,0/151,2,0/152,3,1/153,2,1/S4,F1,2,3,5,7,C149,1,A";
	levelKey[8] = "exo8#34,1,1/35,2,1/36,2,1/37,2,1/38,2,1/39,2,1/40,2,1/41,2,1/42,2,1/43,2,1/44,2,1/45,3,1/50,1,1/51,2,1/52,2,1/53,2,1/54,2,1/55,2,1/56,2,1/57,2,1/58,2,1/59,2,1/60,2,1/61,3,1/66,1,1/67,2,1/68,2,1/69,2,1/70,2,1/71,2,1/72,2,1/73,2,1/74,2,1/75,2,1/76,2,1/77,3,1/82,1,1/83,2,1/84,2,1/85,2,1/86,2,1/87,2,1/88,2,1/89,2,1/90,2,1/91,2,1/92,2,1/93,3,1/98,1,1/99,2,1/100,2,1/101,2,1/102,2,1/103,2,1/104,2,1/105,2,1/106,2,1/107,2,1/108,2,1/109,3,1/114,1,1/115,2,1/116,2,1/117,2,1/118,2,1/119,2,1/120,2,1/121,2,1/122,2,1/123,2,1/124,2,1/125,3,1/130,1,1/131,2,1/132,2,1/133,2,1/134,2,1/135,2,1/136,2,1/137,2,1/138,2,1/139,2,1/140,2,1/141,3,1/146,1,1/147,2,1/148,2,1/149,2,1/150,2,1/151,2,1/152,2,1/153,2,1/154,2,1/155,2,1/156,2,1/157,3,1/162,1,1/163,2,1/164,2,1/165,2,1/166,2,1/167,2,1/168,2,1/169,2,1/170,2,1/171,2,1/172,2,1/173,3,1/178,1,1/179,2,1/180,2,1/181,2,1/182,2,1/183,2,1/184,2,1/185,2,1/186,2,1/187,2,1/188,2,1/189,3,1/194,1,1/195,2,1/196,2,1/197,2,1/198,2,1/199,2,1/200,2,1/201,2,1/202,2,1/203,2,1/204,2,1/205,3,1/215,2,3/216,2,1/217,2,1/218,2,1/219,2,1/220,2,1/221,3,1/S4,F1,2,3,7,C215,1,A";
	levelKey[9] = "exo9#128,3,1/129,2,0/130,1,0/131,3,0/132,2,0/133,1,0/134,3,0/135,2,3/136,1,0/137,3,0/138,1,0/139,2,0/140,3,0/141,1,0/142,2,0/143,3,1/S5,F1,2,3,4,5,6,7,C135,1,A";
	levelKey[10] = "exo10#21,2,4/37,2,0/53,2,0/69,2,0/85,2,0/101,2,0/117,2,0/133,2,0/149,3,0/150,2,0/166,2,0/167,2,0/183,2,0/184,2,0/200,2,0/201,2,0/217,2,0/218,2,0/234,2,1/S6,F1,2,3,7,C21,2,A";
	
	levelKey[11] = "exo11#87,1,1/103,1,0/117,1,1/118,1,0/119,2,5/120,1,0/121,1,1/135,1,0/151,1,1/S4,2,F1,2,3,7,8,C119,3,A";
	levelKey[12] = "exo12#71,1,1/87,1,0/103,1,0/116,1,1/117,1,0/118,1,0/119,2,5/120,1,0/121,1,0/122,1,1/135,1,0/151,1,0/167,1,1/S4,3,F1,2,3,6,7,8,C119,3,A";
	levelKey[13] = "exo13#17,1,4/27,3,1/28,2,0/29,2,0/30,3,1/33,1,0/37,2,1/38,1,0/39,2,1/43,2,0/46,2,0/49,1,0/53,1,0/55,1,0/59,2,0/62,2,0/65,2,1/66,1,0/67,1,0/68,1,0/69,1,0/70,1,0/71,2,1/75,2,0/78,2,0/85,3,0/91,2,0/94,2,0/101,3,0/107,2,0/110,2,0/113,1,1/114,3,0/115,3,0/116,3,0/117,3,0/118,3,0/119,3,0/120,3,0/121,2,0/122,2,0/123,2,0/124,2,0/125,2,0/126,3,1/129,3,0/133,3,0/139,1,0/145,3,0/149,3,0/151,1,1/152,3,0/153,1,1/155,1,0/161,3,0/165,3,0/167,3,0/169,3,0/171,1,0/177,3,0/181,3,0/183,3,0/185,3,0/187,1,0/193,3,0/197,3,0/199,1,1/200,3,0/201,3,0/202,3,0/203,1,0/204,1,0/205,2,1/209,3,0/213,3,0/217,3,0/219,1,0/221,1,0/225,1,1/226,3,0/227,3,0/228,3,0/229,1,1/233,3,1/235,2,1/236,1,0/237,2,1/S4,4,4,F1,2,3,4,5,6,7,8,9,C17,2,A";
	levelKey[14] = "exo14#34,2,0/35,1,0/36,1,0/37,1,0/38,1,0/39,1,0/40,1,0/41,1,0/42,1,0/43,1,0/44,1,0/45,2,0/50,1,0/61,1,0/66,1,0/69,2,0/70,1,0/71,1,0/72,1,0/73,1,0/74,1,0/75,2,0/77,1,0/82,1,0/85,1,0/91,1,0/93,1,0/98,1,0/101,1,0/103,2,0/104,1,0/105,2,0/107,1,0/109,1,0/114,1,0/117,1,0/119,1,0/121,1,0/123,1,0/125,1,0/130,1,0/133,1,0/135,1,0/137,3,1/139,1,0/141,1,0/146,1,0/149,1,0/151,1,0/155,1,0/157,1,0/162,1,0/165,1,0/167,2,0/168,1,0/169,1,0/170,1,0/171,2,0/173,1,0/177,3,1/178,1,2/179,2,0/181,1,0/189,1,0/194,2,0/195,2,0/197,2,0/198,1,0/199,1,0/200,1,0/201,1,0/202,1,0/203,1,0/204,1,0/205,2,0/S4,3,3,F1,2,3,7,8,9,C178,0,A";
	levelKey[15] = "exo15#18,2,0/19,1,0/20,3,0/21,2,0/22,1,0/23,3,0/24,2,0/25,1,0/26,3,0/27,2,0/28,1,0/29,2,0/30,2,0/34,2,0/46,1,0/50,1,0/52,2,0/53,1,0/54,3,0/55,2,0/56,1,0/57,3,0/58,2,0/59,1,0/60,1,0/62,3,0/66,2,0/68,2,0/76,2,0/78,2,0/82,3,0/84,3,0/86,2,0/87,1,0/88,3,0/89,1,0/90,1,0/92,1,0/94,1,0/98,1,0/100,1,0/102,2,0/106,3,0/108,3,0/110,3,0/114,2,0/116,2,0/118,1,0/122,1,0/124,2,0/126,2,0/130,3,0/132,3,0/134,2,0/138,2,0/140,3,0/142,1,0/146,1,0/148,1,0/150,3,0/152,1,1/153,3,0/154,2,0/156,1,0/158,3,0/162,2,0/164,2,0/166,1,0/172,3,0/174,2,0/178,3,0/180,3,0/182,3,0/183,3,0/184,1,0/185,2,0/186,3,0/187,1,0/188,3,0/190,3,0/194,1,0/196,1,0/206,1,0/210,2,2/212,3,0/213,3,0/214,2,0/215,1,0/216,2,0/217,3,0/218,1,0/219,2,0/220,1,0/221,3,0/222,1,0/S7,F1,2,3,7,C210,0,A";
	levelKey[16] = "exo16#35,1,0/36,1,0/37,1,0/38,1,0/40,1,0/41,1,0/42,1,0/43,1,0/50,1,0/51,1,0/52,2,1/53,2,1/54,1,0/55,1,0/56,1,0/57,2,1/58,2,1/59,1,0/60,1,0/66,1,0/67,2,1/70,2,1/71,1,0/72,2,1/75,2,1/76,1,0/82,1,0/83,2,1/87,3,1/91,2,1/92,1,0/98,1,0/99,1,0/100,2,1/106,2,1/107,1,0/108,1,0/115,1,0/116,1,0/117,2,1/121,2,1/122,1,0/123,1,0/132,1,0/133,1,0/134,2,1/136,2,1/137,1,0/138,1,0/149,1,0/150,1,0/151,2,1/152,1,0/153,1,0/166,1,0/167,1,2/168,1,0/S6,3,F1,2,3,7,8,C167,0,A";
	levelKey[17] = "exo17#12,1,1/28,2,0/44,2,0/60,2,0/76,2,0/92,2,0/108,2,0/124,2,0/140,1,2/156,2,0/172,3,0/188,1,0/204,2,0/220,3,0/236,1,0/252,2,1/S6,F1,2,3,7,C140,0,A";
	levelKey[18] = "exo18#101,1,1/102,1,1/103,1,1/104,1,1/117,1,1/118,1,1/119,1,1/120,1,1/133,1,1/134,1,1/135,1,3/136,1,1/149,1,1/150,1,1/151,1,1/152,1,1/S5,3,F1,2,3,5,7,8,C135,1,A";
	levelKey[19] = "exo19#33,2,1/34,1,0/35,1,0/36,1,0/37,1,0/38,1,0/39,1,0/40,1,0/41,1,0/42,1,0/43,1,0/49,1,0/59,1,0/65,1,0/75,1,0/81,1,0/84,2,1/85,1,0/86,1,0/91,3,1/92,1,0/93,1,0/94,1,0/97,1,0/100,1,0/102,1,0/110,1,0/113,1,0/116,1,0/117,1,0/118,1,0/119,1,0/120,3,1/126,1,0/129,1,0/134,1,0/136,1,0/142,1,0/145,1,0/150,1,0/152,1,0/158,1,0/161,1,0/166,1,0/168,1,0/174,1,0/177,1,0/182,1,0/184,1,0/185,1,0/186,1,0/187,1,0/188,1,0/189,1,0/190,2,1/193,1,2/198,1,1/214,1,1/230,1,1/S3,5,F1,2,3,7,8,C193,0,A";
	levelKey[20] = "exo20#50,2,0/51,1,0/52,1,0/53,1,0/54,1,5/57,2,0/68,1,0/73,1,0/84,1,0/88,1,1/89,1,0/100,1,0/105,1,0/116,1,0/117,1,0/118,1,0/119,1,0/120,1,0/121,1,0/122,1,0/123,1,0/124,1,0/125,1,0/126,2,0/132,1,0/148,1,0/164,1,0/180,2,0/S3,6,F1,2,3,7,8,C54,3,A";
	
	
	for(var i : int = 1; i < levelKey.Length; i++)
	{
		PlayerPrefs.SetString("level" + i, levelKey[i]);
	}
}