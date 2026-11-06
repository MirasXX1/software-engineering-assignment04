"""Run with: python3 -m unittest -v test_booking.py (standard library only)."""
import copy
import unittest
from booking import can_book

CASES = [
    ('touch_after',660,720,540,False,[(600,660)],True),
    ('overlap',630,690,540,False,[(600,660)],False),
    ('blocked',660,720,540,True,[(600,660)],False),
    ('exactly_120',720,840,540,False,[(600,660)],True),
    ('duration_121',720,841,540,False,[(600,660)],False),
    ('starts_now',540,570,540,False,[(600,660)],False),
    ('starts_before_now',539,570,540,False,[],False),
    ('reversed',720,660,540,False,[],False),
    ('zero_duration',720,720,540,False,[],False),
    ('negative_start',-1,60,0,False,[],False),
    ('end_above_day',1380,1441,540,False,[],False),
    ('end_of_day',1320,1440,540,False,[],True),
    ('start_at_midnight',0,60,0,False,[],False),
    ('one_minute_after_now',541,542,540,False,[],True),
    ('touch_before',570,600,540,False,[(600,660)],True),
    ('contained',615,645,540,False,[(600,660)],False),
    ('contains_existing',570,690,540,False,[(600,660)],False),
    ('equal_existing',600,660,540,False,[(600,660)],False),
    ('multiple_second_overlap',720,780,540,False,[(600,660),(750,810)],False),
    ('multiple_gap',660,720,540,False,[(600,660),(720,780)],True),
    ('unsorted_existing',660,720,540,False,[(750,810),(600,660)],True),
    ('empty_existing',660,720,540,False,[],True),
    ('fractional_start',660.5,720,540,False,[],False),
    ('fractional_end',660,720.5,540,False,[],False),
    ('string_start','660',720,540,False,[],False),
    ('bool_start',True,60,0,False,[],False),
    ('bool_end',0,True,0,False,[],False),
]
class BookingTests(unittest.TestCase):
    pass

def make_test(case):
    def test(self):
        name,start,end,now,blocked,existing,expected=case
        before=copy.deepcopy(existing)
        actual=can_book(start,end,now,blocked,existing)
        self.assertIs(actual,expected,name)
        self.assertEqual(existing,before,'Input bookings were mutated')
    return test
for case in CASES:
    setattr(BookingTests,'test_'+case[0],make_test(case))

if __name__=='__main__':
    unittest.main()
