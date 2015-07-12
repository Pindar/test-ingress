for i in `seq 100000`; do
	
	v=$[100 + (RANDOM % 100)]$[1000 + (RANDOM % 1000)]
	v=$[RANDOM % 40].${v:1:2}${v:4:3}	

	coap post -p $v coap://localhost/temperature
	sleep 1;
	
done